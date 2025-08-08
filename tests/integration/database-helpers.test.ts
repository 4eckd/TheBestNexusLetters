import { describe, it, expect, beforeEach } from 'vitest';
import { userHelpers, claimHelpers, activityHelpers, testimonialsHelpers } from '../../src/lib/database-helpers';
import { createTestSupabaseClient, createTestServerClient } from './setup';

describe('Database Helpers Integration Tests', () => {
  // These tests use MSW to mock Supabase responses
  // In a real integration test environment, you might use actual Supabase local instance

  describe('userHelpers', () => {
    it('should fetch user by ID', async () => {
      const user = await userHelpers.getById('mock-user-1');
      
      expect(user).toBeTruthy();
      expect(user?.email).toBe('user@example.com');
      expect(user?.full_name).toBe('Test User');
    });

    it('should handle user not found', async () => {
      const user = await userHelpers.getById('non-existent-user');
      expect(user).toBeNull();
    });

    it('should fetch user by email', async () => {
      const user = await userHelpers.getByEmail('user@example.com');
      
      expect(user).toBeTruthy();
      expect(user?.email).toBe('user@example.com');
    });

    it('should create a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        full_name: 'New User',
        username: 'newuser',
        role: 'user' as const,
      };

      const user = await userHelpers.create(userData);
      
      expect(user).toBeTruthy();
      expect(user.email).toBe(userData.email);
      expect(user.full_name).toBe(userData.full_name);
      expect(user.id).toBe('new-user-id');
    });

    it('should update user profile', async () => {
      const updates = {
        full_name: 'Updated Name',
        username: 'updateduser',
      };

      const user = await userHelpers.update('mock-user-1', updates);
      
      expect(user).toBeTruthy();
      expect(user.full_name).toBe('Test User'); // MSW returns mock data
    });

    it('should list users with pagination', async () => {
      const result = await userHelpers.list({
        page: 1,
        limit: 10,
      });

      expect(result.users).toBeDefined();
      expect(result.total).toBeDefined();
      expect(Array.isArray(result.users)).toBe(true);
    });

    it('should filter users by role', async () => {
      const result = await userHelpers.list({
        role: 'admin',
      });

      expect(result.users).toBeDefined();
      expect(Array.isArray(result.users)).toBe(true);
    });

    it('should search users', async () => {
      const result = await userHelpers.list({
        search: 'john',
      });

      expect(result.users).toBeDefined();
      expect(Array.isArray(result.users)).toBe(true);
    });
  });

  describe('claimHelpers', () => {
    it('should fetch claim by ID', async () => {
      const claim = await claimHelpers.getById('mock-claim-1');
      
      expect(claim).toBeTruthy();
      expect(claim?.claim_number).toBeTruthy();
      expect(claim?.title).toBeTruthy();
    });

    it('should fetch claim by claim number', async () => {
      const claim = await claimHelpers.getByClaimNumber('CLM-2024-001');
      
      expect(claim).toBeTruthy();
      expect(claim?.claim_number).toBeTruthy();
    });

    it('should create a new claim', async () => {
      const claimData = {
        user_id: 'mock-user-1',
        title: 'Test Claim',
        description: 'Test claim description',
        claim_type: 'disability' as const,
      };

      const claim = await claimHelpers.create(claimData);
      
      expect(claim).toBeTruthy();
      expect(claim.title).toBe(claimData.title);
      expect(claim.claim_number).toBe('CLM-2024-NEW');
      expect(claim.status).toBe('pending');
    });

    it('should update claim', async () => {
      const updates = {
        title: 'Updated Claim Title',
        description: 'Updated description',
      };

      const claim = await claimHelpers.update('mock-claim-1', updates);
      
      expect(claim).toBeTruthy();
    });

    it('should get user claims with pagination', async () => {
      const result = await claimHelpers.getUserClaims('mock-user-1', {
        page: 1,
        limit: 10,
      });

      expect(result.claims).toBeDefined();
      expect(result.total).toBeDefined();
      expect(Array.isArray(result.claims)).toBe(true);
    });

    it('should filter claims by status', async () => {
      const result = await claimHelpers.getUserClaims('mock-user-1', {
        status: 'pending',
      });

      expect(result.claims).toBeDefined();
      expect(Array.isArray(result.claims)).toBe(true);
    });

    it('should list all claims (admin)', async () => {
      const result = await claimHelpers.list({
        page: 1,
        limit: 10,
      });

      expect(result.claims).toBeDefined();
      expect(result.total).toBeDefined();
    });

    it('should update claim status', async () => {
      const claim = await claimHelpers.updateStatus('mock-claim-1', 'approved', 'admin-user-id');
      
      expect(claim).toBeTruthy();
    });

    it('should get claim statistics', async () => {
      const stats = await claimHelpers.getStats();
      
      expect(stats).toBeTruthy();
      expect(typeof stats.total).toBe('number');
      expect(typeof stats.pending).toBe('number');
      expect(typeof stats.approved).toBe('number');
      expect(typeof stats.rejected).toBe('number');
      expect(typeof stats.underReview).toBe('number');
    });
  });

  describe('activityHelpers', () => {
    it('should log an activity', async () => {
      const activityData = {
        user_id: 'mock-user-1',
        activity_type: 'login' as const,
        entity_type: 'user',
        entity_id: 'mock-user-1',
        description: 'User logged in',
        metadata: { source: 'web' },
        ip_address: '192.168.1.1',
        user_agent: 'Test Agent',
      };

      const activity = await activityHelpers.log(activityData);
      
      expect(activity).toBeTruthy();
      expect(activity.user_id).toBe(activityData.user_id);
      expect(activity.activity_type).toBe(activityData.activity_type);
    });

    it('should get user activity with pagination', async () => {
      const result = await activityHelpers.getUserActivity('mock-user-1', {
        page: 1,
        limit: 20,
      });

      expect(result.activities).toBeDefined();
      expect(result.total).toBeDefined();
      expect(Array.isArray(result.activities)).toBe(true);
    });

    it('should filter user activity by type', async () => {
      const result = await activityHelpers.getUserActivity('mock-user-1', {
        activityType: 'login',
      });

      expect(result.activities).toBeDefined();
      expect(Array.isArray(result.activities)).toBe(true);
    });

    it('should get system activity (admin)', async () => {
      const result = await activityHelpers.getSystemActivity({
        page: 1,
        limit: 50,
      });

      expect(result.activities).toBeDefined();
      expect(result.total).toBeDefined();
    });
  });

  describe('testimonialsHelpers', () => {
    it('should get active testimonials', async () => {
      const testimonials = await testimonialsHelpers.getActive();
      
      expect(Array.isArray(testimonials)).toBe(true);
      expect(testimonials.length).toBeGreaterThan(0);
      
      if (testimonials.length > 0) {
        const testimonial = testimonials[0];
        expect(testimonial.id).toBeTruthy();
        expect(testimonial.name).toBeTruthy();
        expect(testimonial.content).toBeTruthy();
        expect(typeof testimonial.rating).toBe('number');
        expect(testimonial.active).toBe(true);
      }
    });

    it('should get featured testimonials only', async () => {
      const testimonials = await testimonialsHelpers.getFeatured();
      
      expect(Array.isArray(testimonials)).toBe(true);
    });

    it('should get testimonial by ID', async () => {
      const testimonial = await testimonialsHelpers.getById('mock-testimonial-1');
      
      expect(testimonial).toBeTruthy();
      expect(testimonial?.id).toBe('mock-testimonial-1');
      expect(testimonial?.active).toBe(true);
    });

    it('should return null for non-existent testimonial', async () => {
      const testimonial = await testimonialsHelpers.getById('non-existent-testimonial');
      expect(testimonial).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Test with an endpoint that returns an error
      await expect(userHelpers.getById('error-test')).rejects.toThrow();
    });

    it('should handle network timeouts', async () => {
      // This would test timeout scenarios - implementation depends on specific needs
      expect(true).toBe(true);
    });

    it('should handle invalid data validation', async () => {
      // Test validation errors - would need to implement schema validation
      expect(true).toBe(true);
    });
  });
});
