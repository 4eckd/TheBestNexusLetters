/**
 * Mock Supabase client for testing
 */

// Mock subscription object
const mockSubscription = {
  unsubscribe: vi.fn(),
};

// Mock channel object
const mockChannel = {
  on: vi.fn().mockReturnValue(mockChannel),
  subscribe: vi.fn().mockReturnValue(mockSubscription),
  unsubscribe: vi.fn(),
};

// Mock Supabase client
export const supabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {},
          error: null,
        }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {},
            error: null,
          }),
        }),
      }),
    }),
  })),
  channel: vi.fn(() => mockChannel),
  removeChannel: vi.fn(),
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: null },
      error: null,
    }),
  },
};

export const createServerClient = vi.fn(() => supabase);

export default supabase;
