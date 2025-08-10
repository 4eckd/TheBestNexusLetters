/**
 * User-related SWR hooks with caching and error handling
 */

import React from 'react';
import useSWR, { mutate } from 'swr';
import { supabase } from '@/lib/supabase';
import { userHelpers } from '@/lib/database-helpers';
import type { User, UserUpdate } from '@/lib/supabase';
import { DatabaseError } from '@/lib/database-helpers';

// =================================
// FETCHER FUNCTIONS
// =================================

const fetchCurrentUser = async (): Promise<User | null> => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new DatabaseError(
      `Auth error: ${authError.message}`,
      authError.message
    );
  }

  if (!user) {
    return null;
  }

  const dbUser = await userHelpers.getById(user.id);
  return dbUser;
};

const fetchUser = async (userId: string): Promise<User | null> => {
  if (!userId) return null;
  return await userHelpers.getById(userId);
};

const fetchUserProfile = async (userId: string): Promise<User | null> => {
  if (!userId) return null;
  return await userHelpers.getById(userId);
};

const fetchUsers = async (options: {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'user' | 'admin' | 'moderator';
}) => {
  return await userHelpers.list(options);
};

// =================================
// USER HOOKS
// =================================

/**
 * Get current authenticated user
 */
export function useUser() {
  const {
    data: user,
    error,
    isLoading,
    mutate: mutateUser,
  } = useSWR<User | null, Error>(['user', 'current'], fetchCurrentUser, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  });

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Clear user cache
      await mutateUser(null, false);
      // Clear all user-related cache
      mutate(key => Array.isArray(key) && key[0] === 'user', undefined, false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const refreshUser = () => mutateUser();

  return {
    user,
    isLoading,
    error: error as DatabaseError | null,
    isLoggedIn: !!user,
    logout,
    refreshUser,
  };
}

/**
 * Get user by ID
 */
export function useUserById(userId?: string) {
  const {
    data: user,
    error,
    isLoading,
    mutate: mutateUser,
  } = useSWR<User | null, Error>(
    userId ? ['user', userId] : null,
    () => fetchUser(userId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 2,
    }
  );

  return {
    user,
    isLoading,
    error: error as DatabaseError | null,
    refreshUser: () => mutateUser(),
  };
}

/**
 * Get user profile (public data only)
 */
export function useUserProfile(userId?: string) {
  const {
    data: profile,
    error,
    isLoading,
  } = useSWR<User | null, Error>(
    userId ? ['user', 'profile', userId] : null,
    () => fetchUserProfile(userId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 2,
    }
  );

  return {
    profile,
    isLoading,
    error: error as DatabaseError | null,
  };
}

/**
 * Get paginated users list (admin only)
 */
export function useUsers(
  options: {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'user' | 'admin' | 'moderator';
  } = {}
) {
  const {
    data,
    error,
    isLoading,
    mutate: mutateUsers,
  } = useSWR<{ users: User[]; total: number }, Error>(
    ['users', 'list', options],
    () => fetchUsers(options),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 2,
    }
  );

  return {
    users: data?.users ?? [],
    total: data?.total ?? 0,
    isLoading,
    error: error as DatabaseError | null,
    refreshUsers: () => mutateUsers(),
  };
}

// =================================
// MUTATION HOOKS
// =================================

/**
 * Update user profile
 */
export function useUpdateUserProfile() {
  const { user } = useUser();

  const updateProfile = async (data: UserUpdate) => {
    if (!user?.id) {
      throw new DatabaseError('User not authenticated');
    }

    try {
      const updatedUser = await userHelpers.update(user.id, data);

      // Update cache optimistically
      await mutate(['user', 'current'], updatedUser, false);
      await mutate(['user', user.id], updatedUser, false);

      return updatedUser;
    } catch (error) {
      // Revalidate on error
      mutate(['user', 'current']);
      mutate(['user', user.id]);
      throw error;
    }
  };

  return {
    updateProfile,
    isUpdating: false, // You can implement loading state if needed
  };
}

/**
 * Update user avatar
 */
export function useUpdateAvatar() {
  const { user } = useUser();

  const updateAvatar = async (file: File): Promise<User> => {
    if (!user?.id) {
      throw new DatabaseError('User not authenticated');
    }

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        throw new DatabaseError(
          `Upload failed: ${uploadError.message}`,
          uploadError.message
        );
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(uploadData.path);

      // Update user profile with new avatar URL
      const updatedUser = await userHelpers.update(user.id, {
        avatar_url: publicUrl,
      });

      // Update cache
      await mutate(['user', 'current'], updatedUser, false);
      await mutate(['user', user.id], updatedUser, false);

      return updatedUser;
    } catch (error) {
      // Revalidate on error
      mutate(['user', 'current']);
      throw error;
    }
  };

  return {
    updateAvatar,
  };
}

/**
 * Delete user account
 */
export function useDeleteAccount() {
  const { user } = useUser();

  const deleteAccount = async () => {
    if (!user?.id) {
      throw new DatabaseError('User not authenticated');
    }

    try {
      // Delete user from auth
      const { error } = await supabase.auth.admin.deleteUser(user.id);

      if (error) {
        throw new DatabaseError(
          `Failed to delete account: ${error.message}`,
          error.message
        );
      }

      // Clear all cache
      mutate(() => true, undefined, false);
    } catch (error) {
      throw error;
    }
  };

  return {
    deleteAccount,
  };
}

// =================================
// AUTH STATE MANAGEMENT
// =================================

/**
 * Auth state listener
 */
export function useAuthStateChange() {
  React.useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Clear all user cache
        mutate(
          key => Array.isArray(key) && key[0] === 'user',
          undefined,
          false
        );
      } else if (event === 'SIGNED_IN') {
        // Refresh user data
        mutate(['user', 'current']);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
}
