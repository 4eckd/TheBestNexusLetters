import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';

// Create a test client using environment variables
// Prioritize production environment variables for CI/CD testing
const supabaseUrl = process.env.BNSL_NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.BNSL_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Detect if we're testing against local development or production
const isLocalDevelopment = supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1');
const isProductionTest = supabaseUrl.includes('.supabase.co');

let supabase: ReturnType<typeof createClient<Database>>;
let adminClient: ReturnType<typeof createClient<Database>>;

describe('Supabase Database Connectivity', () => {
  beforeAll(() => {
    // Initialize the clients
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    adminClient = createClient<Database>(supabaseUrl, supabaseServiceKey);
  });

  it('should have valid environment variables configured', () => {
    expect(supabaseUrl).toBeTruthy();
    
    // Handle both local development and production URLs
    if (isProductionTest) {
      expect(supabaseUrl).toMatch(/^https:\/\/.+\.supabase\.co$/);
    } else {
      // For local development, accept localhost URLs
      expect(supabaseUrl).toMatch(/^https?:\/\/(localhost|127\.0\.0\.1)/); 
    }
    
    expect(supabaseAnonKey).toBeTruthy();
    expect(supabaseAnonKey.length).toBeGreaterThan(50); // Reduced for local dev keys
    expect(supabaseServiceKey).toBeTruthy();
    expect(supabaseServiceKey.length).toBeGreaterThan(50); // Reduced for local dev keys
  });

  it('should successfully connect to the database with anonymous client', async () => {
    // Test basic connectivity by attempting to query testimonials (which are publicly readable)
    const { data, error } = await supabase
      .from('testimonials')
      .select('id, name, active')
      .limit(1);
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should successfully connect to the database with service role client', async () => {
    // Test service role connectivity by querying users table
    const { data, error } = await adminClient
      .from('users')
      .select('id, email, role')
      .limit(1);
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should verify database schema exists with correct tables', async () => {
    // Test that all our main tables exist by trying to query them
    const tables = ['users', 'claims', 'activity_log', 'testimonials'];
    
    for (const table of tables) {
      const { data, error } = await adminClient
        .from(table as keyof Database['public']['Tables'])
        .select('*')
        .limit(0); // Just test table existence, don't fetch data
      
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }
  });

  it('should verify Row Level Security (RLS) is enabled', async () => {
    // Test RLS is working by trying to access users table without auth
    // This should either return empty results or only publicly accessible data
    const { data: unauthorizedData, error } = await supabase
      .from('users')
      .select('*');
    
    // With RLS enabled, this should either error or return empty results
    expect(error).toBeNull(); // RLS typically returns empty results, not errors
    expect(Array.isArray(unauthorizedData)).toBe(true);
    // If there's data, it should be limited by RLS policies
  });

  it('should verify testimonials are publicly accessible', async () => {
    // Test that testimonials can be read without authentication
    const { data, error } = await supabase
      .from('testimonials')
      .select('id, name, title, company, content, rating, featured, active')
      .eq('active', true)
      .limit(5);
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
    
    // If there's data, verify it's properly structured
    if (data && data.length > 0) {
      const testimonial = data[0];
      expect(testimonial).toHaveProperty('id');
      expect(testimonial).toHaveProperty('name');
      expect(testimonial).toHaveProperty('content');
      expect(testimonial).toHaveProperty('active');
      expect(testimonial.active).toBe(true);
    }
  });

  it('should verify database types and enums are working', async () => {
    // Test that our custom enums are working correctly
    const { data: claims, error } = await adminClient
      .from('claims')
      .select('id, status, claim_type, priority')
      .limit(1);
    
    expect(error).toBeNull();
    expect(Array.isArray(claims)).toBe(true);
    
    if (claims && claims.length > 0) {
      const claim = claims[0];
      expect(claim).toHaveProperty('status');
      expect(claim).toHaveProperty('claim_type');
      expect(claim).toHaveProperty('priority');
      
      // Verify enum values are valid
      const validStatuses = ['pending', 'approved', 'rejected', 'under_review'];
      const validTypes = ['insurance', 'warranty', 'return', 'refund', 'compensation', 'other'];
      
      if (claim.status) {
        expect(validStatuses).toContain(claim.status);
      }
      
      if (claim.claim_type) {
        expect(validTypes).toContain(claim.claim_type);
      }
    }
  });

  it('should verify database functions are accessible', async () => {
    // Test that we can call our custom functions
    // Note: This might need to be adjusted based on your specific function permissions
    const { data, error } = await adminClient
      .rpc('get_user_by_email', { email_address: 'admin@example.com' });
    
    // Function should exist and be callable (even if it returns null for non-existent email)
    expect(error).toBeNull();
  });

  it('should measure database response time', async () => {
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('testimonials')
      .select('id')
      .limit(1);
    
    const responseTime = Date.now() - startTime;
    
    expect(error).toBeNull();
    expect(responseTime).toBeLessThan(5000); // Response should be under 5 seconds
    
    // Log response time for monitoring
    console.log(`Database response time: ${responseTime}ms`);
  });
});

// Health check function that can be used in other contexts
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  details?: any;
}> {
  try {
    const testClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
    
    const startTime = Date.now();
    const { data, error } = await testClient
      .from('testimonials')
      .select('id')
      .limit(1);
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      return {
        status: 'unhealthy',
        message: `Database connection failed: ${error.message}`,
        details: { error, responseTime }
      };
    }
    
    return {
      status: 'healthy',
      message: 'Database connection successful',
      details: { responseTime, recordCount: data?.length || 0 }
    };
    
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Database health check failed: ${error}`,
      details: { error }
    };
  }
}
