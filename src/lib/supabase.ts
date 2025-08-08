import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
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
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    throw new Error('Missing Supabase service role key. Required for server-side operations.');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Types for better TypeScript support
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Helper type for insert operations
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];

// Helper type for update operations  
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

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
export { userHelpers, claimHelpers, activityHelpers, testimonialsHelpers } from './database-helpers';

export default supabase;
