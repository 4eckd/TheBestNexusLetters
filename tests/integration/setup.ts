import { beforeAll, afterEach, afterAll } from 'vitest';
import { server, startMockServer, stopMockServer, resetMockServer } from '../../src/mocks/server';

// Set up test environment variables
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
process.env.SUPABASE_DB_URL = 'postgresql://postgres:postgres@localhost:54322/postgres';

// Start MSW server before all tests
beforeAll(async () => {
  startMockServer();
});

// Reset MSW handlers after each test
afterEach(() => {
  resetMockServer();
});

// Stop MSW server after all tests
afterAll(() => {
  stopMockServer();
});

// Helper function to create test Supabase client
export const createTestSupabaseClient = () => {
  // In integration tests, we can use actual Supabase client
  // or continue using MSW mocks depending on test requirements
  const { createClient } = require('@supabase/supabase-js');
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
};

// Helper for creating server client in tests
export const createTestServerClient = () => {
  const { createClient } = require('@supabase/supabase-js');
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
};
