-- =================================
-- SEED DATA FOR DEVELOPMENT
-- =================================
-- Version: 002
-- Description: Sample data for testing and development

-- Insert sample users
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
    uuid_generate_v4(),
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
    uuid_generate_v4(),
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
    uuid_generate_v4(),
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
    uuid_generate_v4(),
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
    uuid_generate_v4(),
    'guest@example.com',
    'guestuser',
    'Guest User',
    'guest',
    false,
    NULL,
    '{}',
    '{"theme": "light", "notifications": false, "language": "en"}'
  );

-- Insert sample claims (after users are created)
DO $$
DECLARE
  admin_id UUID;
  moderator_id UUID;
  user1_id UUID;
  user2_id UUID;
  guest_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO admin_id FROM public.users WHERE email = 'admin@example.com';
  SELECT id INTO moderator_id FROM public.users WHERE email = 'moderator@example.com';
  SELECT id INTO user1_id FROM public.users WHERE email = 'user1@example.com';
  SELECT id INTO user2_id FROM public.users WHERE email = 'user2@example.com';
  SELECT id INTO guest_id FROM public.users WHERE email = 'guest@example.com';

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
      user1_id,
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
      moderator_id,
      NOW() + INTERVAL '7 days'
    ),
    (
      user2_id,
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
      user1_id,
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
      moderator_id,
      NOW() - INTERVAL '2 days'
    ),
    (
      user2_id,
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
      user1_id,
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
      admin_id,
      NOW() - INTERVAL '5 days'
    );
END $$;

-- Insert some sample activity log entries
DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  claim_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO user1_id FROM public.users WHERE email = 'user1@example.com';
  SELECT id INTO user2_id FROM public.users WHERE email = 'user2@example.com';
  SELECT id INTO claim_id FROM public.claims WHERE title LIKE '%Laptop Screen Damage%' LIMIT 1;

  -- Insert activity log entries
  INSERT INTO public.activity_log (
    user_id,
    activity_type,
    entity_type,
    entity_id,
    description,
    metadata,
    ip_address,
    user_agent
  ) VALUES
    (
      user1_id,
      'login',
      'user',
      user1_id,
      'User logged in successfully',
      '{"login_method": "email", "remember_me": true}'::jsonb,
      '192.168.1.100',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ),
    (
      user1_id,
      'viewed',
      'claim',
      claim_id,
      'Viewed claim details',
      '{"claim_number": "CLM-123456", "view_duration": 120}'::jsonb,
      '192.168.1.100',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ),
    (
      user2_id,
      'login',
      'user',
      user2_id,
      'User logged in successfully',
      '{"login_method": "email", "remember_me": false}'::jsonb,
      '10.0.0.50',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    ),
    (
      user2_id,
      'file_uploaded',
      'claim',
      claim_id,
      'Uploaded supporting document',
      '{"file_name": "additional_receipt.pdf", "file_size": 256000, "file_type": "application/pdf"}'::jsonb,
      '10.0.0.50',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    );
END $$;

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

-- Add some comments or notes (if we add a comments table later)
COMMENT ON TABLE public.users IS 'Sample users include admin, moderator, regular users, and guest account for testing different permission levels';
COMMENT ON TABLE public.claims IS 'Sample claims cover various types (warranty, insurance, return, refund, compensation) with different statuses and priorities';
COMMENT ON TABLE public.activity_log IS 'Activity log contains sample entries for user logins, claim views, and file uploads to demonstrate audit trail functionality';
