import * as crypto from 'crypto';

/**
 * Discourse SSO utility functions
 * Provides helper functions for managing SSO integration with Discourse forums
 */

// Configuration
export const DISCOURSE_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_DISCOURSE_BASE_URL || process.env.DISCOURSE_BASE_URL,
  ssoSecret: process.env.DISCOURSE_SSO_SECRET,
  connectName: process.env.DISCOURSE_CONNECT_NAME || 'Nexus Letters',
} as const;

/**
 * Interface for Discourse SSO parameters
 */
export interface DiscourseSSO {
  external_id: string;
  email: string;
  username: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  admin?: boolean;
  moderator?: boolean;
  suppress_welcome_message?: boolean;
  nonce: string;
}

/**
 * Generate HMAC-SHA256 signature for Discourse SSO
 */
export function generateHMAC(payload: string, secret: string): string {
  if (!secret) {
    throw new Error('DISCOURSE_SSO_SECRET is required for SSO operations');
  }
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Validates HMAC signature using constant-time comparison
 */
export function validateHMAC(payload: string, signature: string, secret: string): boolean {
  if (!secret) {
    return false;
  }
  
  try {
    const expectedSignature = generateHMAC(payload, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('HMAC validation error:', error);
    return false;
  }
}

/**
 * Encode SSO parameters for Discourse
 */
export function encodeSSO(params: DiscourseSSO): string {
  const queryParams = new URLSearchParams();
  
  // Add required fields
  queryParams.set('external_id', params.external_id);
  queryParams.set('email', params.email);
  queryParams.set('username', params.username);
  queryParams.set('name', params.name);
  queryParams.set('nonce', params.nonce);
  
  // Add optional fields
  if (params.avatar_url) queryParams.set('avatar_url', params.avatar_url);
  if (params.bio) queryParams.set('bio', params.bio);
  if (params.admin) queryParams.set('admin', 'true');
  if (params.moderator) queryParams.set('moderator', 'true');
  if (params.suppress_welcome_message) queryParams.set('suppress_welcome_message', 'true');
  
  return Buffer.from(queryParams.toString()).toString('base64');
}

/**
 * Decode SSO parameters from Discourse
 */
export function decodeSSO(ssoPayload: string): Record<string, string> {
  try {
    const decoded = Buffer.from(ssoPayload, 'base64').toString('utf8');
    const params = new URLSearchParams(decoded);
    const result: Record<string, string> = {};
    
    params.forEach((value, key) => {
      result[key] = value;
    });
    
    return result;
  } catch (error) {
    console.error('SSO decoding error:', error);
    throw new Error('Invalid SSO payload');
  }
}

/**
 * Build a complete SSO login URL for Discourse
 */
export function buildSSOLoginUrl(ssoParams: DiscourseSSO): string {
  if (!DISCOURSE_CONFIG.baseUrl || !DISCOURSE_CONFIG.ssoSecret) {
    throw new Error('Discourse configuration is incomplete. Check DISCOURSE_BASE_URL and DISCOURSE_SSO_SECRET');
  }
  
  const payload = encodeSSO(ssoParams);
  const signature = generateHMAC(payload, DISCOURSE_CONFIG.ssoSecret);
  
  const url = new URL('/session/sso_login', DISCOURSE_CONFIG.baseUrl);
  url.searchParams.set('sso', payload);
  url.searchParams.set('sig', signature);
  
  return url.toString();
}

/**
 * Build a category URL with SSO authentication
 */
export function buildCategoryUrl(categorySlug: string, enableSSO: boolean = true): string {
  if (!DISCOURSE_CONFIG.baseUrl) {
    throw new Error('DISCOURSE_BASE_URL is required');
  }
  
  const baseUrl = DISCOURSE_CONFIG.baseUrl.replace(/\/$/, '');
  
  if (enableSSO) {
    // Use SSO login with return path to the category
    const returnPath = encodeURIComponent(`/c/${categorySlug}`);
    return `${baseUrl}/session/sso?return_path=${returnPath}`;
  }
  
  return `${baseUrl}/c/${categorySlug}`;
}

/**
 * Build a topic URL with SSO authentication
 */
export function buildTopicUrl(topicId: string | number, enableSSO: boolean = true): string {
  if (!DISCOURSE_CONFIG.baseUrl) {
    throw new Error('DISCOURSE_BASE_URL is required');
  }
  
  const baseUrl = DISCOURSE_CONFIG.baseUrl.replace(/\/$/, '');
  
  if (enableSSO) {
    // Use SSO login with return path to the topic
    const returnPath = encodeURIComponent(`/t/${topicId}`);
    return `${baseUrl}/session/sso?return_path=${returnPath}`;
  }
  
  return `${baseUrl}/t/${topicId}`;
}

/**
 * Check if Discourse is properly configured
 */
export function isDiscourseConfigured(): boolean {
  return !!(DISCOURSE_CONFIG.baseUrl && DISCOURSE_CONFIG.ssoSecret);
}

/**
 * Get Discourse configuration status
 */
export function getConfigurationStatus(): {
  configured: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  
  if (!DISCOURSE_CONFIG.baseUrl) {
    missing.push('DISCOURSE_BASE_URL');
  }
  
  if (!DISCOURSE_CONFIG.ssoSecret) {
    missing.push('DISCOURSE_SSO_SECRET');
  }
  
  return {
    configured: missing.length === 0,
    missing,
  };
}

/**
 * Validate Discourse SSO request from forum
 */
export function validateSSORequest(sso: string, sig: string): {
  valid: boolean;
  params?: Record<string, string>;
  error?: string;
} {
  if (!DISCOURSE_CONFIG.ssoSecret) {
    return { valid: false, error: 'SSO secret not configured' };
  }
  
  if (!sso || !sig) {
    return { valid: false, error: 'Missing SSO parameters' };
  }
  
  try {
    // Validate signature
    if (!validateHMAC(sso, sig, DISCOURSE_CONFIG.ssoSecret)) {
      return { valid: false, error: 'Invalid signature' };
    }
    
    // Decode parameters
    const params = decodeSSO(sso);
    
    // Validate required nonce
    if (!params.nonce) {
      return { valid: false, error: 'Missing nonce' };
    }
    
    return { valid: true, params };
  } catch (error) {
    return { valid: false, error: 'Failed to validate SSO request' };
  }
}

/**
 * Convert Supabase user to Discourse SSO format
 */
export function userToDiscourseSSO(
  user: any, // Supabase user object
  nonce: string,
  options?: {
    suppressWelcome?: boolean;
    customUsername?: string;
    customName?: string;
  }
): DiscourseSSO {
  const email = user.email;
  const username = options?.customUsername || 
                   user.user_metadata?.username || 
                   user.user_metadata?.preferred_username ||
                   email?.split('@')[0] || 
                   `user_${user.id.substring(0, 8)}`;
                   
  const name = options?.customName ||
               user.user_metadata?.name ||
               user.user_metadata?.full_name ||
               username;

  const result: DiscourseSSO = {
    external_id: user.id,
    email: email!,
    username: username,
    name: name,
    nonce: nonce,
  };

  // Add optional fields only if they have values
  if (user.user_metadata?.avatar_url) {
    result.avatar_url = user.user_metadata.avatar_url;
  }
  if (user.user_metadata?.bio) {
    result.bio = user.user_metadata.bio;
  }
  if (options?.suppressWelcome !== undefined) {
    result.suppress_welcome_message = options.suppressWelcome;
  }

  return result;
}
