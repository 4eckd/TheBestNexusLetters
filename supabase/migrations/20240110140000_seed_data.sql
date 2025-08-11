-- =================================
-- SEED DATA MIGRATION
-- =================================
-- Created: 2024-01-10
-- Version: 003
-- Description: Sample data for testing and development

-- Insert sample testimonials
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

-- Insert sample users (Note: In production, users would be created through Supabase Auth)
INSERT INTO public.users (
  id,
  email,
  username,
  full_name,
  role,
  email_verified,
  phone,
  metadata,
  preferences
) VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'admin@example.com',
    'admin',
    'System Administrator',
    'admin',
    true,
    '+1-555-0001',
    '{"department": "IT", "hire_date": "2023-01-15"}',
    '{"theme": "dark", "notifications": true, "language": "en"}'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    'moderator@example.com',
    'moderator',
    'John Moderator',
    'moderator',
    true,
    '+1-555-0002',
    '{"department": "Support", "hire_date": "2023-03-10"}',
    '{"theme": "light", "notifications": true, "language": "en"}'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'user1@example.com',
    'johnuser',
    'John User',
    'user',
    true,
    '+1-555-0101',
    '{"customer_since": "2023-06-15", "tier": "premium"}',
    '{"theme": "auto", "notifications": false, "language": "en"}'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004'::uuid,
    'user2@example.com',
    'janeuser',
    'Jane Smith',
    'user',
    true,
    '+1-555-0102',
    '{"customer_since": "2023-08-20", "tier": "standard"}',
    '{"theme": "light", "notifications": true, "language": "en"}'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005'::uuid,
    'guest@example.com',
    'guestuser',
    'Guest User',
    'guest',
    false,
    NULL,
    '{}',
    '{"theme": "light", "notifications": false, "language": "en"}'
  );

-- Insert sample claims
INSERT INTO public.claims (
  user_id,
  title,
  description,
  claim_type,
  status,
  amount,
  currency,
  priority,
  tags,
  attachments,
  metadata,
  assigned_to,
  due_date
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'Laptop Screen Damage - Dell XPS 13',
    'Screen cracked after accidental drop. Device still functional but screen has visible damage in top-left corner.',
    'warranty',
    'under_review',
    899.99,
    'USD',
    3,
    ARRAY['hardware', 'laptop', 'screen', 'warranty'],
    '[{"name": "damage_photo_1.jpg", "url": "/uploads/damage_photo_1.jpg", "type": "image/jpeg", "size": 2048576}, {"name": "receipt.pdf", "url": "/uploads/receipt.pdf", "type": "application/pdf", "size": 102400}]'::jsonb,
    '{"purchase_date": "2023-05-15", "warranty_expires": "2025-05-15", "serial_number": "DXP130001", "model": "XPS 13 9320"}'::jsonb,
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    NOW() + INTERVAL '7 days'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004'::uuid,
    'Insurance Claim - Water Damage to MacBook Pro',
    'MacBook Pro suffered water damage due to coffee spill. Device no longer powers on. Need assessment for repair or replacement.',
    'insurance',
    'pending',
    2399.00,
    'USD',
    4,
    ARRAY['insurance', 'water-damage', 'macbook', 'urgent'],
    '[{"name": "water_damage_photos.zip", "url": "/uploads/water_damage_photos.zip", "type": "application/zip", "size": 15728640}, {"name": "insurance_form.pdf", "url": "/uploads/insurance_form.pdf", "type": "application/pdf", "size": 524288}]'::jsonb,
    '{"incident_date": "2024-01-10", "policy_number": "INS-2023-001234", "model": "MacBook Pro 16-inch", "serial_number": "MBP160012"}'::jsonb,
    NULL,
    NOW() + INTERVAL '5 days'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'Return Request - Wireless Headphones',
    'Product does not meet expectations. Sound quality is poor and battery life is much shorter than advertised.',
    'return',
    'approved',
    199.99,
    'USD',
    2,
    ARRAY['return', 'headphones', 'audio', 'quality-issue'],
    '[{"name": "return_form.pdf", "url": "/uploads/return_form.pdf", "type": "application/pdf", "size": 204800}]'::jsonb,
    '{"purchase_date": "2024-01-05", "return_window_expires": "2024-02-05", "reason": "quality_issues", "original_order": "ORD-2024-0001"}'::jsonb,
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    NOW() - INTERVAL '2 days'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004'::uuid,
    'Refund Request - Software License',
    'Software not compatible with current system requirements. Seeking full refund within 30-day guarantee period.',
    'refund',
    'pending',
    299.99,
    'USD',
    1,
    ARRAY['refund', 'software', 'compatibility'],
    '[{"name": "system_specs.txt", "url": "/uploads/system_specs.txt", "type": "text/plain", "size": 2048}]'::jsonb,
    '{"purchase_date": "2024-01-15", "license_key": "SW-2024-ABCD1234", "software": "Professional Suite v2.0", "reason": "incompatible"}'::jsonb,
    NULL,
    NOW() + INTERVAL '3 days'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'Compensation Claim - Service Outage Impact',
    'Business operations were affected by 6-hour service outage. Seeking compensation for lost productivity and revenue.',
    'compensation',
    'rejected',
    1500.00,
    'USD',
    5,
    ARRAY['compensation', 'outage', 'business-impact', 'sla'],
    '[{"name": "outage_impact_report.pdf", "url": "/uploads/outage_impact_report.pdf", "type": "application/pdf", "size": 1048576}, {"name": "revenue_loss_calculation.xlsx", "url": "/uploads/revenue_loss_calc.xlsx", "type": "application/vnd.ms-excel", "size": 32768}]'::jsonb,
    '{"outage_start": "2024-01-08T14:00:00Z", "outage_end": "2024-01-08T20:00:00Z", "affected_services": ["email", "database", "web_app"], "business_type": "e-commerce"}'::jsonb,
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    NOW() - INTERVAL '5 days'
  );

-- Update some timestamps for more realistic data
UPDATE public.users 
SET created_at = NOW() - INTERVAL '6 months',
    updated_at = NOW() - INTERVAL '1 week'
WHERE email IN ('user1@example.com', 'user2@example.com');

UPDATE public.users 
SET created_at = NOW() - INTERVAL '1 year',
    updated_at = NOW() - INTERVAL '1 month'
WHERE email IN ('admin@example.com', 'moderator@example.com');

UPDATE public.claims 
SET created_at = NOW() - INTERVAL '2 weeks',
    updated_at = NOW() - INTERVAL '3 days'
WHERE status = 'under_review';

UPDATE public.claims 
SET created_at = NOW() - INTERVAL '1 month',
    updated_at = NOW() - INTERVAL '1 week',
    resolved_at = NOW() - INTERVAL '1 week'
WHERE status IN ('approved', 'rejected');

-- Add some comments or notes
COMMENT ON TABLE public.users IS 'Sample users include admin, moderator, regular users, and guest account for testing different permission levels';
COMMENT ON TABLE public.claims IS 'Sample claims cover various types (warranty, insurance, return, refund, compensation) with different statuses and priorities';
COMMENT ON TABLE public.testimonials IS 'Sample testimonials for marketing pages with featured/active status controls';
