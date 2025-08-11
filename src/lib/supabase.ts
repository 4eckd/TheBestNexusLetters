import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Supabase client configuration with fallback for development
const rawSupabaseUrl = process.env.BNSL_NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawAnonKey = process.env.BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Handle placeholder values in development
const supabaseUrl =
  rawSupabaseUrl &&
  rawSupabaseUrl !== 'your-project-url.supabase.co' &&
  rawSupabaseUrl.startsWith('http')
    ? rawSupabaseUrl
    : 'https://mock-supabase-url.supabase.co';

const supabaseAnonKey =
  rawAnonKey && rawAnonKey !== 'your-anon-key'
    ? rawAnonKey
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Runtime validation for production environment
// Only validate when actually running in production, not during build or in CI
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Client-side production validation
  if (!rawSupabaseUrl || !rawAnonKey || rawSupabaseUrl.includes('your-project-url') || rawAnonKey.includes('your-anon-key')) {
    console.warn('⚠️ Missing or invalid Supabase environment variables in production. Some features may not work correctly.');
  }
} else if (typeof window === 'undefined' && process.env.NODE_ENV === 'production' && !process.env.CI && !process.env.VERCEL_ENV) {
  // Server-side production validation (but not in CI or preview environments)
  if (!rawSupabaseUrl || !rawAnonKey || rawSupabaseUrl.includes('your-project-url') || rawAnonKey.includes('your-anon-key')) {
    console.warn('⚠️ Missing or invalid Supabase environment variables in production server.');
  }
}

// Create typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'X-Client-Info': '@supabase/supabase-js',
    },
  },
});

// Server-side client for API routes (using service role key)
export const createServerClient = () => {
  const supabaseServiceKey = process.env.BNSL_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    throw new Error(
      'Missing Supabase service role key. Required for server-side operations.'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Types for better TypeScript support
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

// Helper type for insert operations
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

// Helper type for update operations
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Export specific table types for convenience
export type User = Tables<'users'>;
export type Claim = Tables<'claims'>;
export type ActivityLog = Tables<'activity_log'>;

// Export enum types
export type UserRole = Enums<'user_role'>;
export type ClaimStatus = Enums<'claim_status'>;
export type ClaimType = Enums<'claim_type'>;
export type ActivityType = Enums<'activity_type'>;

// Export insert types
export type UserInsert = TablesInsert<'users'>;
export type ClaimInsert = TablesInsert<'claims'>;
export type ActivityLogInsert = TablesInsert<'activity_log'>;

// Export update types
export type UserUpdate = TablesUpdate<'users'>;
export type ClaimUpdate = TablesUpdate<'claims'>;

// Re-export database helpers
// export { userHelpers, claimHelpers, activityHelpers, testimonialsHelpers } from './database-helpers';

export default supabase;
