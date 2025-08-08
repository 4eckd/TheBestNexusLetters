import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import {
  DISCOURSE_CONFIG,
  validateSSORequest,
  userToDiscourseSSO,
  buildSSOLoginUrl,
  isDiscourseConfigured,
  generateHMAC,
  encodeSSO
} from '@/lib/discourse';

/**
 * GET handler - Initiates SSO login from Discourse
 * This handles incoming SSO requests from Discourse
 */
export async function GET(request: NextRequest) {
  try {
    // Check configuration
    if (!isDiscourseConfigured()) {
      return NextResponse.json(
        { error: 'Discourse SSO not properly configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sso = searchParams.get('sso');
    const sig = searchParams.get('sig');

    // Validate SSO request using utility function
    const validation = validateSSORequest(sso || '', sig || '');
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid SSO request' },
        { status: 400 }
      );
    }

    const { params: ssoParams } = validation;
    const nonce = ssoParams!.nonce;

    // Get current user from Supabase
    const supabaseServerClient = createServerClient();
    
    // For now, we'll need to get user info from session or JWT token
    // In a real implementation, you'd extract this from the request headers
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      // Redirect to login page with return URL
      const returnUrl = encodeURIComponent(request.url);
      return NextResponse.redirect(
        new URL(`/auth/login?returnUrl=${returnUrl}`, request.url)
      );
    }

    // Extract JWT and get user info (simplified - you might use a different approach)
    const token = authHeader.substring(7);
    
    try {
      const { data: { user }, error } = await supabaseServerClient.auth.getUser(token);
      
      if (error || !user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Check if user has admin/moderator roles
      const { data: userData } = await supabaseServerClient
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      // Convert Supabase user to Discourse SSO format using utility
      const discourseSSO = userToDiscourseSSO(user, nonce!);
      
      // Add role-based permissions
      if (userData?.role === 'admin') {
        discourseSSO.admin = true;
      } else if (userData?.role === 'moderator') {
        discourseSSO.moderator = true;
      }

      // Build complete SSO login URL using utility
      const discourseLoginUrl = buildSSOLoginUrl(discourseSSO);

      return NextResponse.redirect(discourseLoginUrl);

    } catch (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Discourse SSO error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Optional: Handle logout or other SSO operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'logout':
        // Handle logout synchronization between app and Discourse
        // This could invalidate sessions, clear cookies, etc.
        return NextResponse.json({ success: true });
      
      default:
        return NextResponse.json(
          { error: 'Unsupported action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Discourse SSO POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
