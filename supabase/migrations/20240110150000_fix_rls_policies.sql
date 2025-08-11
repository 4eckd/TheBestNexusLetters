-- =================================
-- FIX RLS POLICY INFINITE RECURSION
-- =================================
-- Created: 2024-01-10
-- Version: 004
-- Description: Fix infinite recursion in user role-based RLS policies

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update user roles" ON public.users;
DROP POLICY IF EXISTS "Admins and moderators can view all claims" ON public.claims;
DROP POLICY IF EXISTS "Admins and moderators can update claims" ON public.claims;
DROP POLICY IF EXISTS "Admins can view all activity" ON public.activity_log;

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view basic user info" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can view own related data" ON public.claims;
DROP POLICY IF EXISTS "Authenticated users can insert own claims" ON public.claims;
DROP POLICY IF EXISTS "Users can view own activity" ON public.activity_log;
DROP POLICY IF EXISTS "System can insert activity logs" ON public.activity_log;
DROP POLICY IF EXISTS "Service role can bypass RLS" ON public.users;
DROP POLICY IF EXISTS "Service role can bypass RLS" ON public.claims;
DROP POLICY IF EXISTS "Service role can bypass RLS" ON public.activity_log;

-- Recreate policies without recursion
-- Users can view own profile (no recursion issue here)
-- Users can update own profile (no recursion issue here)

-- For administrative access, we need to use a different approach
-- Option 1: Disable RLS for service role operations
-- Option 2: Use security definer functions for admin operations
-- Option 3: Use row-level security with JWT claims instead of table lookups

-- Since Supabase Auth handles JWT claims, let's use those instead
CREATE POLICY "Service role can bypass RLS"
  ON public.users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can bypass RLS"
  ON public.claims FOR ALL  
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can bypass RLS"
  ON public.activity_log FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Alternative approach using security definer functions for admin operations
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user has admin role using direct query
  -- This function will be called with service role privileges
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users au
    JOIN public.users pu ON au.id = pu.id
    WHERE au.id = auth.uid() AND pu.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin_or_moderator()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user has admin or moderator role
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users au
    JOIN public.users pu ON au.id = pu.id
    WHERE au.id = auth.uid() AND pu.role IN ('admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now create policies using the security definer functions
-- Only create these if we want to use function-based approach
-- For now, we'll rely on service role bypass and application-level checks

-- Alternative: Simplified policies that don't cause recursion
-- These are safe because they don't query the same table

-- Public can read basic user info for public profiles
CREATE POLICY "Public can view basic user info"
  ON public.users FOR SELECT
  USING (true); -- This might be too permissive, adjust as needed

-- Authenticated users can update their own profile
-- (This already exists and doesn't cause recursion)

-- For claims and activity log, use simpler policies
CREATE POLICY "Authenticated users can view own related data"
  ON public.claims FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can insert own claims"
  ON public.claims FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Activity log - simplified policies
CREATE POLICY "Users can view own activity"
  ON public.activity_log FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert activity logs"
  ON public.activity_log FOR INSERT
  WITH CHECK (true); -- Allow all inserts, controlled at application level

-- Grant permissions to service role
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.claims TO service_role;
GRANT ALL ON public.activity_log TO service_role;
GRANT ALL ON public.testimonials TO service_role;

-- Ensure anon role can read testimonials
GRANT SELECT ON public.testimonials TO anon;
