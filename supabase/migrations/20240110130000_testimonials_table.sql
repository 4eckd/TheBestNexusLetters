-- =================================
-- TESTIMONIALS TABLE MIGRATION
-- =================================
-- Created: 2024-01-10
-- Version: 002
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

-- Grant permissions
GRANT ALL ON public.testimonials TO authenticated;
GRANT SELECT ON public.testimonials TO anon;

-- Add comment
COMMENT ON TABLE public.testimonials IS 'Customer testimonials for marketing pages with featured/active status controls';
