-- Migration for Admin User Management and Collection Permissions
-- This migration adds policies for admins to manage users and collections

-- Drop existing policies that conflict
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own coletas" ON public.coletas;
DROP POLICY IF EXISTS "Users can delete their own coletas" ON public.coletas;

-- Update profile policies to allow admins to manage non-admin users
CREATE POLICY "Users can update their own profile" ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can update non-admin profiles" ON public.profiles
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin') AND
    NOT EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = profiles.id AND role = 'admin'
    )
  );

-- Update coletas policies to allow admins to manage any collection
CREATE POLICY "Users can update their own coletas" ON public.coletas 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any coleta" ON public.coletas
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own coletas" ON public.coletas 
  FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any coleta" ON public.coletas
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to view all user roles
CREATE POLICY "Admins can view all user roles" ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to update user roles (except other admins)
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Admins can insert non-admin roles" ON public.user_roles
  FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') AND
    role = 'researcher'
  );

CREATE POLICY "Admins can update non-admin roles" ON public.user_roles
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin') AND
    NOT EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = user_roles.user_id AND ur.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete non-admin roles" ON public.user_roles
  FOR DELETE
  USING (
    public.has_role(auth.uid(), 'admin') AND
    NOT EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = user_roles.user_id AND ur.role = 'admin'
    )
  );

-- Function to check if a user is admin (helper for frontend)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(user_id, 'admin');
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO authenticated;
