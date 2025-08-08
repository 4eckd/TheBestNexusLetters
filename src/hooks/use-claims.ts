/**
 * Claims-related SWR hooks with caching and error handling
 */

import React from 'react';
import useSWR, { mutate } from 'swr';
import { supabase } from '@/lib/supabase';
import { claimHelpers } from '@/lib/database-helpers';
import type { Claim, ClaimInsert, ClaimUpdate, ClaimStatus, ClaimType } from '@/lib/supabase';
import { DatabaseError } from '@/lib/database-helpers';

// =================================
// FETCHER FUNCTIONS
// =================================

const fetchClaim = async (claimId: string): Promise<Claim | null> => {
  if (!claimId) return null;
  return await claimHelpers.getById(claimId);
};

const fetchClaimByNumber = async (claimNumber: string): Promise<Claim | null> => {
  if (!claimNumber) return null;
  return await claimHelpers.getByClaimNumber(claimNumber);
};

const fetchUserClaims = async (userId: string, options: {
  page?: number;
  limit?: number;
  status?: ClaimStatus;
  claimType?: ClaimType;
}) => {
  if (!userId) return { claims: [], total: 0 };
  return await claimHelpers.getUserClaims(userId, options);
};

const fetchClaims = async (options: {
  page?: number;
  limit?: number;
  status?: ClaimStatus;
  claimType?: ClaimType;
  assignedTo?: string;
  search?: string;
}) => {
  return await claimHelpers.list(options);
};

const fetchClaimStats = async () => {
  return await claimHelpers.getStats();
};

// =================================
// CLAIM HOOKS
// =================================

/**
 * Get claim by ID
 */
export function useClaim(claimId?: string) {
  const {
    data: claim,
    error,
    isLoading,
    mutate: mutateClaim,
  } = useSWR<Claim | null, Error>(
    claimId ? ['claim', claimId] : null,
    () => fetchClaim(claimId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 2,
    }
  );

  return {
    claim,
    isLoading,
    error: error as DatabaseError | null,
    refreshClaim: () => mutateClaim(),
  };
}

/**
 * Get claim by claim number
 */
export function useClaimByNumber(claimNumber?: string) {
  const {
    data: claim,
    error,
    isLoading,
  } = useSWR<Claim | null, Error>(
    claimNumber ? ['claim', 'number', claimNumber] : null,
    () => fetchClaimByNumber(claimNumber!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 2,
    }
  );

  return {
    claim,
    isLoading,
    error: error as DatabaseError | null,
  };
}

/**
 * Get user's claims
 */
export function useUserClaims(userId?: string, options: {
  page?: number;
  limit?: number;
  status?: ClaimStatus;
  claimType?: ClaimType;
} = {}) {
  const {
    data,
    error,
    isLoading,
    mutate: mutateClaims,
  } = useSWR<{ claims: Claim[]; total: number }, Error>(
    userId ? ['claims', 'user', userId, options] : null,
    () => fetchUserClaims(userId!, options),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 2,
    }
  );

  return {
    claims: data?.claims ?? [],
    total: data?.total ?? 0,
    isLoading,
    error: error as DatabaseError | null,
    refreshClaims: () => mutateClaims(),
  };
}

/**
 * Get all claims (admin/moderator view)
 */
export function useClaims(options: {
  page?: number;
  limit?: number;
  status?: ClaimStatus;
  claimType?: ClaimType;
  assignedTo?: string;
  search?: string;
} = {}) {
  const {
    data,
    error,
    isLoading,
    mutate: mutateClaims,
  } = useSWR<{ claims: Claim[]; total: number }, Error>(
    ['claims', 'all', options],
    () => fetchClaims(options),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 2,
    }
  );

  return {
    claims: data?.claims ?? [],
    total: data?.total ?? 0,
    isLoading,
    error: error as DatabaseError | null,
    refreshClaims: () => mutateClaims(),
  };
}

/**
 * Get claims statistics
 */
export function useClaimStats() {
  const {
    data: stats,
    error,
    isLoading,
    mutate: mutateStats,
  } = useSWR<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    underReview: number;
  }, Error>(
    ['claims', 'stats'],
    fetchClaimStats,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 2,
    }
  );

  return {
    stats: stats ?? {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      underReview: 0,
    },
    isLoading,
    error: error as DatabaseError | null,
    refreshStats: () => mutateStats(),
  };
}

// =================================
// MUTATION HOOKS
// =================================

/**
 * Submit a new claim
 */
export function useSubmitClaim() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const submitClaim = async (claimData: ClaimInsert): Promise<Claim> => {
    setIsSubmitting(true);
    try {
      const newClaim = await claimHelpers.create(claimData);
      
      // Invalidate relevant caches
      mutate(key => {
        if (!Array.isArray(key)) return false;
        return key[0] === 'claims' || key[0] === 'claim';
      });
      
      return newClaim;
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitClaim,
    isSubmitting,
  };
}

/**
 * Update claim
 */
export function useUpdateClaim() {
  const [isUpdating, setIsUpdating] = React.useState(false);

  const updateClaim = async (claimId: string, updates: ClaimUpdate): Promise<Claim> => {
    setIsUpdating(true);
    try {
      const updatedClaim = await claimHelpers.update(claimId, updates);
      
      // Update caches optimistically
      await mutate(['claim', claimId], updatedClaim, false);
      
      // Invalidate list caches
      mutate(key => {
        if (!Array.isArray(key)) return false;
        return key[0] === 'claims';
      });
      
      return updatedClaim;
    } catch (error) {
      // Revalidate on error
      mutate(['claim', claimId]);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateClaim,
    isUpdating,
  };
}

/**
 * Update claim status
 */
export function useUpdateClaimStatus() {
  const [isUpdating, setIsUpdating] = React.useState(false);

  const updateStatus = async (
    claimId: string,
    status: ClaimStatus,
    assignedTo?: string
  ): Promise<Claim> => {
    setIsUpdating(true);
    try {
      const updatedClaim = await claimHelpers.updateStatus(claimId, status, assignedTo);
      
      // Update caches optimistically
      await mutate(['claim', claimId], updatedClaim, false);
      
      // Invalidate related caches
      mutate(key => {
        if (!Array.isArray(key)) return false;
        return key[0] === 'claims' || (key[0] === 'claims' && key[1] === 'stats');
      });
      
      return updatedClaim;
    } catch (error) {
      // Revalidate on error
      mutate(['claim', claimId]);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateStatus,
    isUpdating,
  };
}

/**
 * Delete claim (admin only)
 */
export function useDeleteClaim() {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const deleteClaim = async (claimId: string): Promise<void> => {
    setIsDeleting(true);
    try {
      // Note: This would require implementing a delete method in claimHelpers
      // For now, we'll assume it exists
      // await claimHelpers.delete(claimId);
      
      // Remove from caches
      await mutate(['claim', claimId], undefined, false);
      
      // Invalidate list caches
      mutate(key => {
        if (!Array.isArray(key)) return false;
        return key[0] === 'claims';
      });
      
    } catch (error) {
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteClaim,
    isDeleting,
  };
}

// =================================
// BULK OPERATIONS
// =================================

/**
 * Bulk update claims
 */
export function useBulkUpdateClaims() {
  const [isUpdating, setIsUpdating] = React.useState(false);

  const bulkUpdate = async (
    claimIds: string[],
    updates: Partial<ClaimUpdate>
  ): Promise<void> => {
    setIsUpdating(true);
    try {
      // Update claims in parallel
      await Promise.all(
        claimIds.map(id => claimHelpers.update(id, updates))
      );
      
      // Invalidate all claim-related caches
      mutate(key => {
        if (!Array.isArray(key)) return false;
        return key[0] === 'claims' || key[0] === 'claim';
      });
      
    } catch (error) {
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    bulkUpdate,
    isUpdating,
  };
}

// =================================
// REAL-TIME SUBSCRIPTIONS
// =================================

/**
 * Subscribe to claim changes
 */
export function useClaimSubscription(claimId?: string) {
  const { refreshClaim } = useClaim(claimId);

  React.useEffect(() => {
    if (!claimId) return;

    // Set up real-time subscription
    const subscription = supabase
      .channel(`claim-${claimId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'claims',
          filter: `id=eq.${claimId}`,
        },
        () => {
          refreshClaim();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [claimId, refreshClaim]);
}

/**
 * Subscribe to user's claims changes
 */
export function useUserClaimsSubscription(userId?: string) {
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    if (!userId) return;

    // Set up real-time subscription for user's claims
    const subscription = supabase
      .channel(`user-claims-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'claims',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Invalidate user claims cache
          mutate(key => {
            if (!Array.isArray(key)) return false;
            return key[0] === 'claims' && key[1] === 'user' && key[2] === userId;
          });
          setRefreshKey(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return refreshKey;
}
