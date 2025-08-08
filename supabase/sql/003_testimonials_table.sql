-- =================================
-- TESTIMONIALS TABLE MIGRATION
-- =================================
-- Created: $(date)
-- Version: 003
-- Description: Add testimonials table for marketing pages

-- =================================
-- TESTIMONIALS TABLE
-- =================================
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  title VARCHAR(150),
  company VARCHAR(100),
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at trigger for testimonials
CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create index for performance
CREATE INDEX idx_testimonials_featured ON public.testimonials(featured) WHERE featured = TRUE AND active = TRUE;
CREATE INDEX idx_testimonials_active ON public.testimonials(active);

-- =================================
-- ROW LEVEL SECURITY POLICIES
-- =================================
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access for testimonials (no auth required)
CREATE POLICY "Anyone can view active testimonials"
  ON public.testimonials FOR SELECT
  USING (active = TRUE);

-- Only admins can manage testimonials
CREATE POLICY "Admins can manage testimonials"
  ON public.testimonials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =================================
-- SEED DATA FOR TESTIMONIALS
-- =================================
INSERT INTO public.testimonials (
  name,
  title,
  company,
  content,
  rating,
  featured,
  active,
  metadata
) VALUES
  (
    'Sarah Johnson',
    'CEO',
    'TechStart Solutions',
    'The Best Nexus Letters transformed our business communications. Their attention to detail and professional approach exceeded all expectations.',
    5,
    TRUE,
    TRUE,
    '{"location": "San Francisco, CA", "industry": "Technology"}'::jsonb
  ),
  (
    'Michael Chen',
    'Operations Director', 
    'Global Logistics Inc',
    'Outstanding service quality and responsive support. They handled our complex requirements with remarkable efficiency.',
    5,
    TRUE,
    TRUE,
    '{"location": "New York, NY", "industry": "Logistics"}'::jsonb
  ),
  (
    'Emily Rodriguez',
    'Marketing Manager',
    'Creative Agency Pro',
    'Professional, timely, and exactly what we needed. The team went above and beyond to deliver exceptional results.',
    5,
    TRUE,
    TRUE,
    '{"location": "Austin, TX", "industry": "Marketing"}'::jsonb
  ),
  (
    'James Wilson',
    'Founder',
    'StartupLaunch',
    'Incredible attention to detail and customer service. They made our project seamless from start to finish.',
    4,
    FALSE,
    TRUE,
    '{"location": "Seattle, WA", "industry": "Startup"}'::jsonb
  ),
  (
    'Lisa Thompson',
    'Project Manager',
    'Enterprise Corp',
    'Highly recommend their services. Professional team with deep expertise and excellent communication throughout.',
    5,
    FALSE,
    TRUE,
    '{"location": "Chicago, IL", "industry": "Enterprise"}'::jsonb
  ),
  (
    'David Kim',
    'CTO',
    'Innovation Labs',
    'Best decision we made this year. The quality of work and attention to our specific needs was remarkable.',
    5,
    FALSE,
    TRUE,
    '{"location": "Los Angeles, CA", "industry": "Research"}'::jsonb
  );

-- Add comment
COMMENT ON TABLE public.testimonials IS 'Customer testimonials for marketing pages with featured/active status controls';
