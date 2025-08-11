/**
 * Mock database helpers for testing
 */

// Mock user helpers
export const userHelpers = {
  async getById(userId: string) {
    return {
      id: userId,
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },
  async getByEmail(email: string) {
    return {
      id: '123',
      email,
      full_name: 'Test User',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },
};

// Mock claim helpers
export const claimHelpers = {
  async getById(claimId: string) {
    return {
      id: claimId,
      claim_number: 'CLM-001',
      title: 'Test Claim',
      description: 'Test claim description',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },
  async getByClaimNumber(claimNumber: string) {
    return {
      id: '123',
      claim_number: claimNumber,
      title: 'Test Claim',
      description: 'Test claim description',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },
  async getUserClaims(userId: string) {
    return {
      claims: [],
      total: 0,
    };
  },
  async list() {
    return {
      claims: [],
      total: 0,
    };
  },
  async getStats() {
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      underReview: 0,
    };
  },
};

export class DatabaseError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message);
    this.name = 'DatabaseError';
  }
}
