import { http, HttpResponse } from 'msw';

// Mock Supabase API responses
export const supabaseHandlers = [
  // Users API
  http.get('*/rest/v1/users', () => {
    return HttpResponse.json({
      data: [
        {
          id: 'mock-user-1',
          email: 'user1@example.com',
          full_name: 'John Doe',
          username: 'johndoe',
          role: 'user',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'mock-user-2',
          email: 'admin@example.com',
          full_name: 'Admin User',
          username: 'admin',
          role: 'admin',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    });
  }),

  http.get('*/rest/v1/users/*', ({ params }) => {
    const userId = params[0];
    return HttpResponse.json({
      data: {
        id: userId,
        email: 'user@example.com',
        full_name: 'Test User',
        username: 'testuser',
        role: 'user',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    });
  }),

  http.post('*/rest/v1/users', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({
      data: {
        id: 'new-user-id',
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  }),

  // Claims API
  http.get('*/rest/v1/claims', () => {
    return HttpResponse.json({
      data: [
        {
          id: 'mock-claim-1',
          user_id: 'mock-user-1',
          claim_number: 'CLM-2024-001',
          title: 'Test Claim 1',
          description: 'Test claim description',
          claim_type: 'disability',
          status: 'pending',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    });
  }),

  http.post('*/rest/v1/claims', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({
      data: {
        id: 'new-claim-id',
        claim_number: 'CLM-2024-NEW',
        ...data,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  }),

  // Activity Log API
  http.get('*/rest/v1/activity_log', () => {
    return HttpResponse.json({
      data: [
        {
          id: 'mock-activity-1',
          user_id: 'mock-user-1',
          activity_type: 'login',
          entity_type: 'user',
          entity_id: 'mock-user-1',
          description: 'User logged in',
          metadata: {},
          ip_address: '127.0.0.1',
          user_agent: 'Test Agent',
          created_at: '2024-01-01T00:00:00Z',
        },
      ],
    });
  }),

  // Testimonials API
  http.get('*/rest/v1/testimonials', () => {
    return HttpResponse.json({
      data: [
        {
          id: 'mock-testimonial-1',
          name: 'John Smith',
          title: 'Veteran',
          company: 'US Army',
          content: 'Great service!',
          rating: 5,
          avatar_url: null,
          featured: true,
          active: true,
          metadata: {},
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    });
  }),

  // Auth endpoints
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
      },
    });
  }),

  // Error responses for testing error handling
  http.get('*/rest/v1/users/error-test', () => {
    return HttpResponse.json(
      {
        error: {
          message: 'Test error message',
          code: 'TEST_ERROR',
        },
      },
      { status: 400 }
    );
  }),
];

// External API handlers
export const externalHandlers = [
  // Discourse SSO endpoint mock
  http.post('/api/discourse/sso', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({
      success: true,
      redirect_url: 'https://community.example.com/session/sso_login?sso=test&sig=test',
    });
  }),

  // Generic API error for testing
  http.get('/api/test-error', () => {
    return HttpResponse.json(
      {
        error: 'Something went wrong',
      },
      { status: 500 }
    );
  }),
];

export const handlers = [...supabaseHandlers, ...externalHandlers];
