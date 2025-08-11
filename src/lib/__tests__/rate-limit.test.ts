import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import {
  rateLimit,
  strictRateLimit,
  authRateLimit,
  apiRateLimit,
  contactRateLimit,
  createRateLimitResponse,
} from '../rate-limit';

// Mock NextRequest
const createMockRequest = (ip?: string, headers: Record<string, string> = {}): NextRequest => {
  const request = {
    headers: {
      get: vi.fn((key: string) => {
        if (key === 'x-forwarded-for' && ip) return ip;
        if (key === 'x-real-ip' && !headers['x-forwarded-for']) return ip;
        if (key === 'cf-connecting-ip' && !headers['x-forwarded-for'] && !headers['x-real-ip']) return ip;
        return headers[key] || null;
      }),
    },
  } as unknown as NextRequest;
  
  return request;
};

describe('Rate Limit Middleware', () => {
  beforeEach(() => {
    // Reset the internal store between tests
    vi.clearAllMocks();
  });

  describe('rateLimit function', () => {
    it('should create a rate limiter with default options', async () => {
      const limiter = rateLimit();
      const req = createMockRequest('192.168.1.1');
      
      const result = await limiter(req);
      
      expect(result.success).toBe(true);
      expect(result.limit).toBe(100);
      expect(result.remaining).toBe(99);
      expect(result.resetTime).toBeGreaterThan(Date.now());
    });

    it('should create a rate limiter with custom options', async () => {
      const limiter = rateLimit({
        windowMs: 60000, // 1 minute
        maxRequests: 5,
      });
      const req = createMockRequest('192.168.1.2');
      
      const result = await limiter(req);
      
      expect(result.success).toBe(true);
      expect(result.limit).toBe(5);
      expect(result.remaining).toBe(4);
    });

    it('should block requests when limit is exceeded', async () => {
      const limiter = rateLimit({
        windowMs: 60000,
        maxRequests: 2,
      });
      const req = createMockRequest('192.168.1.3');
      
      // First request - should succeed
      let result = await limiter(req);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(1);
      
      // Second request - should succeed
      result = await limiter(req);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(0);
      
      // Third request - should fail
      result = await limiter(req);
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should handle different IP extraction methods', async () => {
      // Test x-forwarded-for header
      let req = createMockRequest(undefined, { 'x-forwarded-for': '203.0.113.1, 198.51.100.1' });
      let limiter = rateLimit({ maxRequests: 1 });
      let result = await limiter(req);
      expect(result.success).toBe(true);
      
      // Test x-real-ip header
      req = createMockRequest(undefined, { 'x-real-ip': '203.0.113.2' });
      limiter = rateLimit({ maxRequests: 1 });
      result = await limiter(req);
      expect(result.success).toBe(true);
      
      // Test cf-connecting-ip header
      req = createMockRequest(undefined, { 'cf-connecting-ip': '203.0.113.3' });
      limiter = rateLimit({ maxRequests: 1 });
      result = await limiter(req);
      expect(result.success).toBe(true);
    });

    it('should use anonymous key when no IP is found', async () => {
      const req = createMockRequest();
      const limiter = rateLimit({ maxRequests: 1 });
      
      const result = await limiter(req);
      expect(result.success).toBe(true);
    });

    it('should use custom key generator', async () => {
      const customKeyGen = vi.fn(() => 'custom-key');
      const limiter = rateLimit({
        maxRequests: 1,
        keyGenerator: customKeyGen,
      });
      const req = createMockRequest('192.168.1.4');
      
      await limiter(req);
      expect(customKeyGen).toHaveBeenCalledWith(req);
    });

    it('should reset window after time expires', async () => {
      // Mock Date.now to control time
      const originalNow = Date.now;
      let currentTime = 1000000;
      vi.spyOn(Date, 'now').mockImplementation(() => currentTime);
      
      const limiter = rateLimit({
        windowMs: 1000,
        maxRequests: 1,
      });
      const req = createMockRequest('192.168.1.5');
      
      // First request
      let result = await limiter(req);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(0);
      
      // Second request - should fail
      result = await limiter(req);
      expect(result.success).toBe(false);
      
      // Move time forward
      currentTime += 2000;
      
      // Third request - should succeed after window reset
      result = await limiter(req);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(0);
      
      // Restore original Date.now
      Date.now = originalNow;
    });

    it('should handle skipSuccessfulRequests option', async () => {
      const limiter = rateLimit({
        maxRequests: 2,
        skipSuccessfulRequests: true,
      });
      const req = createMockRequest('192.168.1.6');
      
      // Mock successful response
      const successResponse = { ok: true } as any;
      
      let result = await limiter(req, successResponse);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(1); // Should still count because we pass response
    });
  });

  describe('Predefined rate limiters', () => {
    it('should have correct configuration for strictRateLimit', async () => {
      const req = createMockRequest('192.168.2.1');
      const result = await strictRateLimit(req);
      
      expect(result.limit).toBe(5);
      expect(result.remaining).toBe(4);
    });

    it('should have correct configuration for authRateLimit', async () => {
      const req = createMockRequest('192.168.2.2');
      const result = await authRateLimit(req);
      
      expect(result.limit).toBe(10);
      expect(result.remaining).toBe(9);
    });

    it('should have correct configuration for apiRateLimit', async () => {
      const req = createMockRequest('192.168.2.3');
      const result = await apiRateLimit(req);
      
      expect(result.limit).toBe(100);
      expect(result.remaining).toBe(99);
    });

    it('should have correct configuration for contactRateLimit', async () => {
      const req = createMockRequest('192.168.2.4');
      const result = await contactRateLimit(req);
      
      expect(result.limit).toBe(3);
      expect(result.remaining).toBe(2);
    });
  });

  describe('createRateLimitResponse', () => {
    it('should return null for successful requests', () => {
      const result = {
        success: true,
        limit: 100,
        remaining: 50,
        resetTime: Date.now() + 60000,
      };
      
      const response = createRateLimitResponse(result);
      expect(response).toBeNull();
    });

    it('should create error response for failed requests', () => {
      const resetTime = Date.now() + 60000;
      const result = {
        success: false,
        limit: 100,
        remaining: 0,
        resetTime,
      };
      
      const response = createRateLimitResponse(result, 'Rate limit exceeded');
      
      expect(response).toBeTruthy();
      expect(response?.status).toBe(429);
      
      // Test headers
      const headers = response?.headers;
      expect(headers?.get('X-RateLimit-Limit')).toBe('100');
      expect(headers?.get('X-RateLimit-Remaining')).toBe('0');
      expect(headers?.get('X-RateLimit-Reset')).toBe(new Date(resetTime).toISOString());
      expect(headers?.get('Content-Type')).toBe('application/json');
      expect(headers?.get('Retry-After')).toBeTruthy();
    });

    it('should include custom error message', async () => {
      const result = {
        success: false,
        limit: 5,
        remaining: 0,
        resetTime: Date.now() + 30000,
      };
      
      const response = createRateLimitResponse(result, 'Custom error message');
      const body = await response?.json();
      
      expect(body.error).toBe('Custom error message');
      expect(body.retryAfter).toBeGreaterThan(0);
    });
  });

  describe('Cleanup functionality', () => {
    it('should handle cleanup of expired entries', async () => {
      // This tests the internal cleanup mechanism
      // Since cleanup is called internally, we test it indirectly
      const limiter = rateLimit({
        windowMs: 100, // Very short window
        maxRequests: 1,
      });
      
      const req1 = createMockRequest('192.168.3.1');
      const req2 = createMockRequest('192.168.3.2');
      
      await limiter(req1);
      
      // Wait for cleanup interval
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should still work for new IP
      const result = await limiter(req2);
      expect(result.success).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle malformed IP addresses gracefully', async () => {
      const req = createMockRequest(undefined, { 'x-forwarded-for': 'invalid-ip' });
      const limiter = rateLimit();
      
      const result = await limiter(req);
      expect(result.success).toBe(true);
    });

    it('should handle empty forwarded-for header', async () => {
      const req = createMockRequest(undefined, { 'x-forwarded-for': '' });
      const limiter = rateLimit();
      
      const result = await limiter(req);
      expect(result.success).toBe(true);
    });

    it('should handle multiple comma-separated IPs in forwarded-for', async () => {
      const req = createMockRequest(undefined, { 
        'x-forwarded-for': '203.0.113.1, 198.51.100.1, 192.0.2.1' 
      });
      const limiter = rateLimit({ maxRequests: 1 });
      
      let result = await limiter(req);
      expect(result.success).toBe(true);
      
      // Second request should fail (same IP)
      result = await limiter(req);
      expect(result.success).toBe(false);
    });
  });
});
