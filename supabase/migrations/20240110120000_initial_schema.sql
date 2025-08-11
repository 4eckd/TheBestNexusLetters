-- =================================
-- INITIAL SCHEMA MIGRATION
-- =================================
-- Created: 2024-01-10
-- Version: 001
-- Description: Core schema for Users, Claims, and Activity Logging system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================
-- USERS TABLE
-- =================================

-- Create user role enum
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'user', 'guest');

CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  email_verified BOOLEAN DEFAULT FALSE,
  phone VARCHAR(20),
  metadata JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =================================
-- CLAIMS TABLE
-- =================================
CREATE TYPE claim_status AS ENUM ('pending', 'approved', 'rejected', 'under_review');
CREATE TYPE claim_type AS ENUM ('insurance', 'warranty', 'return', 'refund', 'compensation', 'other');

CREATE TABLE public.claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  claim_number VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  claim_type claim_type NOT NULL,
  status claim_status DEFAULT 'pending',
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  tags TEXT[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  assigned_to UUID REFERENCES public.users(id),
  due_date TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at trigger for claims
CREATE TRIGGER claims_updated_at
  BEFORE UPDATE ON public.claims
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Generate unique claim numbers
CREATE OR REPLACE FUNCTION generate_claim_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    new_number := 'CLM-' || LPAD(FLOOR(RANDOM() * 999999 + 1)::TEXT, 6, '0');
    SELECT EXISTS(SELECT 1 FROM public.claims WHERE claim_number = new_number) INTO exists_check;
    EXIT WHEN NOT exists_check;
  END LOOP;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Set default claim number
ALTER TABLE public.claims 
ALTER COLUMN claim_number SET DEFAULT generate_claim_number();

-- =================================
-- ACTIVITY LOG TABLE
-- =================================
CREATE TYPE activity_type AS ENUM ('created', 'updated', 'deleted', 'viewed', 'login', 'logout', 'claim_submitted', 'claim_approved', 'claim_rejected', 'file_uploaded', 'comment_added', 'status_changed', 'assignment_changed', 'other');

CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  activity_type activity_type NOT NULL,
  entity_type VARCHAR(50), -- 'user', 'claim', 'file', etc.
  entity_id UUID,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  session_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON public.activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created_at ON public.activity_log(created_at);
CREATE INDEX idx_activity_log_activity_type ON public.activity_log(activity_type);

-- =================================
-- ROW LEVEL SECURITY POLICIES
-- =================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Users RLS Policies (Least-privilege access)
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Admins can update user roles"
  ON public.users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Claims RLS Policies
CREATE POLICY "Users can view own claims"
  ON public.claims FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own claims"
  ON public.claims FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own pending claims"
  ON public.claims FOR UPDATE
  USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins and moderators can view all claims"
  ON public.claims FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Admins and moderators can update claims"
  ON public.claims FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Assigned users can view their assigned claims"
  ON public.claims FOR SELECT
  USING (assigned_to = auth.uid());

-- Activity Log RLS Policies
CREATE POLICY "Users can view own activity"
  ON public.activity_log FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Activity log is insert only for authenticated users"
  ON public.activity_log FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can view all activity"
  ON public.activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =================================
-- HELPER FUNCTIONS
-- =================================

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_user_id UUID,
  p_activity_type activity_type,
  p_entity_type VARCHAR(50) DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.activity_log (
    user_id,
    activity_type,
    entity_type,
    entity_id,
    description,
    metadata
  ) VALUES (
    p_user_id,
    p_activity_type,
    p_entity_type,
    p_entity_id,
    p_description,
    p_metadata
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user by email (for auth integration)
CREATE OR REPLACE FUNCTION get_user_by_email(email_address TEXT)
RETURNS public.users AS $$
DECLARE
  user_record public.users;
BEGIN
  SELECT * INTO user_record
  FROM public.users
  WHERE email = email_address;
  
  RETURN user_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =================================
-- TRIGGERS FOR ACTIVITY LOGGING
-- =================================

-- Log user creation
CREATE OR REPLACE FUNCTION log_user_creation()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_activity(
    NEW.id,
    'created',
    'user',
    NEW.id,
    'User account created',
    jsonb_build_object('email', NEW.email, 'role', NEW.role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_creation_log
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION log_user_creation();

-- Log claim creation
CREATE OR REPLACE FUNCTION log_claim_creation()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_activity(
    NEW.user_id,
    'claim_submitted',
    'claim',
    NEW.id,
    'Claim submitted: ' || NEW.title,
    jsonb_build_object(
      'claim_number', NEW.claim_number,
      'claim_type', NEW.claim_type,
      'amount', NEW.amount
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER claim_creation_log
  AFTER INSERT ON public.claims
  FOR EACH ROW
  EXECUTE FUNCTION log_claim_creation();

-- Log claim status changes
CREATE OR REPLACE FUNCTION log_claim_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    PERFORM log_activity(
      NEW.user_id,
      CASE NEW.status
        WHEN 'approved' THEN 'claim_approved'::activity_type
        WHEN 'rejected' THEN 'claim_rejected'::activity_type
        ELSE 'status_changed'::activity_type
      END,
      'claim',
      NEW.id,
      'Claim status changed from ' || OLD.status || ' to ' || NEW.status,
      jsonb_build_object(
        'claim_number', NEW.claim_number,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'assigned_to', NEW.assigned_to
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER claim_status_change_log
  AFTER UPDATE ON public.claims
  FOR EACH ROW
  EXECUTE FUNCTION log_claim_status_change();

-- =================================
-- INDEXES FOR PERFORMANCE
-- =================================

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_role ON public.users(role);

CREATE INDEX idx_claims_user_id ON public.claims(user_id);
CREATE INDEX idx_claims_status ON public.claims(status);
CREATE INDEX idx_claims_claim_type ON public.claims(claim_type);
CREATE INDEX idx_claims_assigned_to ON public.claims(assigned_to);
CREATE INDEX idx_claims_created_at ON public.claims(created_at);
CREATE INDEX idx_claims_claim_number ON public.claims(claim_number);

-- =================================
-- GRANT PERMISSIONS
-- =================================

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant permissions on tables
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.claims TO authenticated;
GRANT ALL ON public.activity_log TO authenticated;

-- Grant select permissions to anon for public data if needed
GRANT SELECT ON public.users TO anon;

COMMENT ON TABLE public.users IS 'User accounts and profiles';
COMMENT ON TABLE public.claims IS 'Insurance/warranty claims submitted by users';
COMMENT ON TABLE public.activity_log IS 'Audit trail for all system activities';
