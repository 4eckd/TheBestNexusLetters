import { NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds
  maxRequests?: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: NextRequest) => string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up expired entries periodically
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    Object.keys(store).forEach(key => {
      if (store[key] && store[key].resetTime < now) {
        delete store[key];
      }
    });
    lastCleanup = now;
  }
}

export function rateLimit(options: RateLimitOptions = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    keyGenerator = (req: NextRequest) => getIP(req) || 'anonymous',
  } = options;

  return async function rateLimitMiddleware(
    req: NextRequest,
    res?: NextResponse
  ): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    resetTime: number;
  }> {
    cleanup();

    const key = keyGenerator(req);
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    const record = store[key];

    // Check if request should be counted
    const shouldCount = !skipSuccessfulRequests && !skipFailedRequests;

    if (
      shouldCount ||
      (!skipSuccessfulRequests && !res) ||
      (!skipFailedRequests && res && !res.ok)
    ) {
      record.count++;
    }

    const remaining = Math.max(0, maxRequests - record.count);
    const success = record.count <= maxRequests;

    return {
      success,
      limit: maxRequests,
      remaining,
      resetTime: record.resetTime,
    };
  };
}

function getIP(req: NextRequest): string | null {
  // Check various headers for IP address
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || null;
  }

  return realIP || cfConnectingIP || null;
}

// Predefined rate limiters for common scenarios
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests per 15 minutes
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 auth attempts per 15 minutes
});

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 API calls per 15 minutes
});

export const contactRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 contact form submissions per hour
});

// Rate limit response helper
export function createRateLimitResponse(
  result: {
    success: boolean;
    limit: number;
    remaining: number;
    resetTime: number;
  },
  message = 'Too many requests'
) {
  const headers = new Headers({
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  });

  if (!result.success) {
    return new NextResponse(
      JSON.stringify({
        error: message,
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          ...Object.fromEntries(headers.entries()),
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil(
            (result.resetTime - Date.now()) / 1000
          ).toString(),
        },
      }
    );
  }

  return null; // Success - no response needed
}
