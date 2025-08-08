/**
 * Database Helper Functions
 * Provides convenient, typed methods for common database operations
 */

import { supabase, createServerClient } from './supabase';
import type {
  User,
  Claim,
  ActivityLog,
  UserInsert,
  UserUpdate,
  ClaimInsert,
  ClaimUpdate,
  ActivityLogInsert,
  UserRole,
  ClaimStatus,
  ClaimType,
  ActivityType,
} from './supabase';

// Error types
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// =================================
// USER OPERATIONS
// =================================

export const userHelpers = {
  /**
   * Get user by ID
   */
  async getById(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new DatabaseError(`Failed to get user: ${error.message}`, error.code, error);
    }

    return data;
  },

  /**
   * Get user by email
   */
  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new DatabaseError(`Failed to get user by email: ${error.message}`, error.code, error);
    }

    return data;
  },

  /**
   * Create a new user
   */
  async create(userData: UserInsert): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(`Failed to create user: ${error.message}`, error.code, error);
    }

    return data;
  },

  /**
   * Update user profile
   */
  async update(userId: string, updates: UserUpdate): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(`Failed to update user: ${error.message}`, error.code, error);
    }

    return data;
  },

  /**
   * Get users with pagination
   */
  async list(options: {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
  } = {}): Promise<{ users: User[]; total: number }> {
    const { page = 1, limit = 20, role, search } = options;
    const offset = (page - 1) * limit;

    let query = supabase.from('users').select('*', { count: 'exact' });

    // Apply filters
    if (role) {
      query = query.eq('role', role);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,username.ilike.%${search}%`);
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new DatabaseError(`Failed to list users: ${error.message}`, error.code, error);
    }

    return {
      users: data || [],
      total: count || 0,
    };
  },

  /**
   * Update user role (admin only)
   */
  async updateRole(userId: string, newRole: UserRole): Promise<User> {
    const serverClient = createServerClient();
    
    const { data, error } = await serverClient
      .from('users')
      .update({ 
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(`Failed to update user role: ${error.message}`, error.code, error);
    }

    return data;
  },
};

// =================================
// CLAIM OPERATIONS
// =================================

export const claimHelpers = {
  /**
   * Get claim by ID
   */
  async getById(claimId: string): Promise<Claim | null> {
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('id', claimId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new DatabaseError(`Failed to get claim: ${error.message}`, error.code, error);
    }

    return data;
  },

  /**
   * Get claim by claim number
   */
  async getByClaimNumber(claimNumber: string): Promise<Claim | null> {
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('claim_number', claimNumber)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new DatabaseError(`Failed to get claim by number: ${error.message}`, error.code, error);
    }

    return data;
  },

  /**
   * Create a new claim
   */
  async create(claimData: ClaimInsert): Promise<Claim> {
    const { data, error } = await supabase
      .from('claims')
      .insert(claimData)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(`Failed to create claim: ${error.message}`, error.code, error);
    }

    return data;
  },

  /**
   * Update claim
   */
  async update(claimId: string, updates: ClaimUpdate): Promise<Claim> {
    const { data, error } = await supabase
      .from('claims')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', claimId)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(`Failed to update claim: ${error.message}`, error.code, error);
    }

    return data;
  },

  /**
   * Get user's claims
   */
  async getUserClaims(userId: string, options: {
    page?: number;
    limit?: number;
    status?: ClaimStatus;
    claimType?: ClaimType;
  } = {}): Promise<{ claims: Claim[]; total: number }> {
    const { page = 1, limit = 20, status, claimType } = options;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('claims')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (claimType) {
      query = query.eq('claim_type', claimType);
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new DatabaseError(`Failed to get user claims: ${error.message}`, error.code, error);
    }

    return {
      claims: data || [],
      total: count || 0,
    };
  },

  /**
   * Get all claims (admin/moderator only)
   */
  async list(options: {
    page?: number;
    limit?: number;
    status?: ClaimStatus;
    claimType?: ClaimType;
    assignedTo?: string;
    search?: string;
  } = {}): Promise<{ claims: Claim[]; total: number }> {
    const { page = 1, limit = 20, status, claimType, assignedTo, search } = options;
    const offset = (page - 1) * limit;

    let query = supabase.from('claims').select('*', { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (claimType) {
      query = query.eq('claim_type', claimType);
    }

    if (assignedTo) {
      query = query.eq('assigned_to', assignedTo);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,claim_number.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new DatabaseError(`Failed to list claims: ${error.message}`, error.code, error);
    }

    return {
      claims: data || [],
      total: count || 0,
    };
  },

  /**
   * Update claim status
   */
  async updateStatus(claimId: string, status: ClaimStatus, assignedTo?: string): Promise<Claim> {
    const updates: ClaimUpdate = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (assignedTo) {
      updates.assigned_to = assignedTo;
    }

    if (status === 'approved' || status === 'rejected') {
      updates.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('claims')
      .update(updates)
      .eq('id', claimId)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(`Failed to update claim status: ${error.message}`, error.code, error);
    }

    return data;
  },

  /**
   * Get claims statistics
   */
  async getStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    underReview: number;
  }> {
    const { data, error } = await supabase
      .from('claims')
      .select('status');

    if (error) {
      throw new DatabaseError(`Failed to get claim stats: ${error.message}`, error.code, error);
    }

    const stats = {
      total: data.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      underReview: 0,
    };

    data.forEach((claim) => {
      switch (claim.status) {
        case 'pending':
          stats.pending++;
          break;
        case 'approved':
          stats.approved++;
          break;
        case 'rejected':
          stats.rejected++;
          break;
        case 'under_review':
          stats.underReview++;
          break;
      }
    });

    return stats;
  },
};

// =================================
// ACTIVITY LOG OPERATIONS
// =================================

export const activityHelpers = {
  /**
   * Log an activity
   */
  async log(activityData: ActivityLogInsert): Promise<ActivityLog> {
    const { data, error } = await supabase
      .from('activity_log')
      .insert(activityData)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(`Failed to log activity: ${error.message}`, error.code, error);
    }

    return data;
  },

  /**
   * Get user's activity log
   */
  async getUserActivity(userId: string, options: {
    page?: number;
    limit?: number;
    activityType?: ActivityType;
  } = {}): Promise<{ activities: ActivityLog[]; total: number }> {
    const { page = 1, limit = 50, activityType } = options;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('activity_log')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (activityType) {
      query = query.eq('activity_type', activityType);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new DatabaseError(`Failed to get user activity: ${error.message}`, error.code, error);
    }

    return {
      activities: data || [],
      total: count || 0,
    };
  },

  /**
   * Get system-wide activity (admin only)
   */
  async getSystemActivity(options: {
    page?: number;
    limit?: number;
    activityType?: ActivityType;
    entityType?: string;
  } = {}): Promise<{ activities: ActivityLog[]; total: number }> {
    const { page = 1, limit = 100, activityType, entityType } = options;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('activity_log')
      .select('*', { count: 'exact' });

    if (activityType) {
      query = query.eq('activity_type', activityType);
    }

    if (entityType) {
      query = query.eq('entity_type', entityType);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new DatabaseError(`Failed to get system activity: ${error.message}`, error.code, error);
    }

    return {
      activities: data || [],
      total: count || 0,
    };
  },
};

// =================================
// UTILITY FUNCTIONS
// =================================

/**
 * Check if user has permission for operation
 */
export async function checkUserPermission(
  userId: string,
  requiredRole: UserRole[] = ['admin']
): Promise<boolean> {
  const user = await userHelpers.getById(userId);
  return user ? requiredRole.includes(user.role) : false;
}

/**
 * Log activity with context (helper wrapper)
 */
export async function logActivity(
  userId: string,
  activityType: ActivityType,
  entityType?: string,
  entityId?: string,
  description?: string,
  metadata: Record<string, any> = {},
  request?: {
    ip?: string;
    userAgent?: string;
  }
): Promise<ActivityLog> {
  return activityHelpers.log({
    user_id: userId,
    activity_type: activityType,
    entity_type: entityType,
    entity_id: entityId,
    description,
    metadata,
    ip_address: request?.ip,
    user_agent: request?.userAgent,
  });
}

// =================================
// TESTIMONIALS OPERATIONS
// =================================

export interface Testimonial {
  id: string;
  name: string;
  title: string | null;
  company: string | null;
  content: string;
  rating: number;
  avatar_url: string | null;
  featured: boolean;
  active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const testimonialsHelpers = {
  /**
   * Get all active testimonials
   */
  async getActive(featuredOnly: boolean = false): Promise<Testimonial[]> {
    let query = supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (featuredOnly) {
      query = query.eq('featured', true);
    }

    const { data, error } = await query;

    if (error) {
      throw new DatabaseError(`Failed to get testimonials: ${error.message}`, error.code, error);
    }

    return data || [];
  },

  /**
   * Get featured testimonials for home page
   */
  async getFeatured(): Promise<Testimonial[]> {
    return this.getActive(true);
  },

  /**
   * Get testimonial by ID
   */
  async getById(testimonialId: string): Promise<Testimonial | null> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', testimonialId)
      .eq('active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new DatabaseError(`Failed to get testimonial: ${error.message}`, error.code, error);
    }

    return data;
  },
};
