import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { contactRateLimit, createRateLimitResponse } from '@/lib/rate-limit';

// Input validation schema
const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  honeypot: z.string().optional(), // Bot detection
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await contactRateLimit(request);
    const rateLimitResponse = createRateLimitResponse(
      rateLimitResult,
      'Too many contact form submissions. Please try again later.'
    );

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Parse and validate request body
    const body = await request.json();
    
    // Check honeypot (bot detection)
    if (body.honeypot && body.honeypot.trim() !== '') {
      // This is likely a bot
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      );
    }

    // Validate input
    const validationResult = contactSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    // Additional security checks
    const suspiciousPatterns = [
      /\b(script|javascript|vbscript|onload|onerror)\b/i,
      /<[^>]*>/g, // HTML tags
      /\b(exec|eval|system|cmd)\b/i,
    ];

    const allText = `${name} ${email} ${subject} ${message}`;
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(allText));

    if (isSuspicious) {
      return NextResponse.json(
        { error: 'Invalid content detected' },
        { status: 400 }
      );
    }

    // Sanitize input (remove potential XSS)
    const sanitizedData = {
      name: name.trim().replace(/[<>]/g, ''),
      email: email.trim().toLowerCase(),
      subject: subject.trim().replace(/[<>]/g, ''),
      message: message.trim().replace(/[<>]/g, ''),
    };

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send confirmation email to user
    
    // For demo purposes, we'll just log the data
    console.log('Contact form submission:', {
      ...sanitizedData,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 
           request.headers.get('x-real-ip') || 
           'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message. We will get back to you soon.',
      },
      { 
        status: 200,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        },
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred. Please try again later.',
        code: 'INTERNAL_ERROR' 
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}
