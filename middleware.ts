import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in production, use Redis or similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration for different routes
const rateLimitConfig = {
  '/api/contact': { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 requests per hour
  '/api/auth': { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // 10 requests per 15 minutes
  '/api': { maxRequests: 100, windowMs: 15 * 60 * 1000 }, // General API limit
} as const;

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }

  return realIP || cfConnectingIP || 'unknown';
}

function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimit.get(key);

  if (!record || record.resetTime < now) {
    // Create new record or reset expired record
    const newRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimit.set(key, newRecord);
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: newRecord.resetTime,
    };
  }

  // Update existing record
  record.count++;
  const remaining = Math.max(0, maxRequests - record.count);
  const allowed = record.count <= maxRequests;

  return {
    allowed,
    remaining,
    resetTime: record.resetTime,
  };
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Security headers that complement next.config.ts headers
  response.headers.set(
    'X-Robots-Tag',
    'noindex, nofollow, noarchive, nosnippet'
  );

  // Additional headers for API routes
  if (response.headers.get('content-type')?.includes('application/json')) {
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    // Find the most specific rate limit config
    let config: { maxRequests: number; windowMs: number } =
      rateLimitConfig['/api']; // Default

    for (const [route, routeConfig] of Object.entries(rateLimitConfig)) {
      if (pathname.startsWith(route) && route !== '/api') {
        config = routeConfig;
        break;
      }
    }

    const rateLimitKey = `${clientIP}:${pathname}`;
    const { allowed, remaining, resetTime } = checkRateLimit(
      rateLimitKey,
      config.maxRequests,
      config.windowMs
    );

    if (!allowed) {
      const response = new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(resetTime).toISOString(),
            'Retry-After': Math.ceil(
              (resetTime - Date.now()) / 1000
            ).toString(),
          },
        }
      );

      return addSecurityHeaders(response);
    }

    // Create response with rate limit headers
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set(
      'X-RateLimit-Reset',
      new Date(resetTime).toISOString()
    );

    return addSecurityHeaders(response);
  }

  // Block access to sensitive files and directories
  const blockedPaths = [
    '/.env',
    '/.env.local',
    '/.env.production',
    '/.env.development',
    '/package.json',
    '/package-lock.json',
    '/pnpm-lock.yaml',
    '/yarn.lock',
    '/.git',
    '/.next',
    '/node_modules',
    '/logs',
  ];

  if (blockedPaths.some(blocked => pathname.startsWith(blocked))) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Security headers for all responses
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
