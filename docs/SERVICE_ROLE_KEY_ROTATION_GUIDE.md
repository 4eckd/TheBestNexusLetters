# SERVICE_ROLE_KEY Rotation Guide

## Overview

The SERVICE_ROLE_KEY is a critical security credential that provides elevated access to your Supabase database. Regular rotation is essential for maintaining security, especially in production environments.

## When to Rotate the SERVICE_ROLE_KEY

- **Immediately**: If you suspect the key has been compromised
- **Scheduled**: Every 90 days in production environments
- **After incidents**: Following security audits or staff changes
- **Before deployment**: When moving to production

## Pre-Rotation Checklist

- [ ] Identify all systems using the current SERVICE_ROLE_KEY
- [ ] Prepare backup access methods
- [ ] Schedule maintenance window if needed
- [ ] Document current key usage
- [ ] Notify team members

## Rotation Steps

### Step 1: Generate New Service Role Key

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Under "Project API keys", find the `service_role` key
4. Click "Generate new key"
5. Copy the new key immediately (it won't be shown again)

### Step 2: Update Environment Variables

Update all deployment environments:

```bash
# Production
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Development (if using production keys)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Update CI/CD Systems

Update environment variables in:

- GitHub Secrets (if using GitHub Actions)
- Vercel Environment Variables
- Docker compose files
- Kubernetes secrets
- Any other deployment systems

### Step 4: Update Local Development

```bash
# Update .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=your-new-service-role-key" >> .env.local

# Restart development server
npm run dev
```

### Step 5: Verification

Test that the new key works:

```bash
# Test database connection
npm run test:db

# Run health check
curl https://your-app.com/api/health

# Check logs for authentication errors
```

### Step 6: Revoke Old Key

1. Return to Supabase dashboard
2. Navigate to Settings → API
3. Delete the old service role key
4. Monitor for any failed requests

## Security Best Practices

### Environment Variable Security

- ✅ Store in encrypted environment variables
- ✅ Use different keys for different environments
- ✅ Never commit keys to version control
- ✅ Rotate keys regularly (90 days max)
- ❌ Don't log keys in application logs
- ❌ Don't share keys via insecure channels

### Access Control

```javascript
// ✅ Good: Verify user permissions before using service role
const { data: user } = await supabase.auth.getUser();
if (!user || user.role !== 'admin') {
  throw new Error('Unauthorized');
}

// Use service role client for admin operations
const adminClient = createServerClient();
```

### Monitoring

Set up alerts for:

- Failed authentication attempts
- Unusual database access patterns
- RLS policy violations
- Service role key usage spikes

## Emergency Response

### If Key is Compromised

1. **Immediate Actions**:
   - Generate new key immediately
   - Update all environments
   - Revoke old key
   - Review access logs

2. **Investigation**:
   - Check recent database activity
   - Review application logs
   - Audit user permissions
   - Check for data exfiltration

3. **Recovery**:
   - Reset user passwords if needed
   - Update all affected systems
   - Implement additional monitoring
   - Document incident

## Automation Script

Create a rotation script for regular updates:

```bash
#!/bin/bash
# rotate-service-key.sh

set -e

echo "🔄 Starting SERVICE_ROLE_KEY rotation..."

# Backup current key
OLD_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d '=' -f2)
echo "OLD_KEY=$OLD_KEY" > .env.backup

# Prompt for new key
echo "📝 Please enter the new SERVICE_ROLE_KEY:"
read -s NEW_KEY

# Update environment files
sed -i "s/SUPABASE_SERVICE_ROLE_KEY=.*/SUPABASE_SERVICE_ROLE_KEY=$NEW_KEY/" .env.local

# Test new key
echo "🧪 Testing new key..."
if npm run test:db; then
    echo "✅ New key is working!"
    rm .env.backup
else
    echo "❌ New key failed, rolling back..."
    mv .env.backup .env.local
    exit 1
fi

echo "🎉 SERVICE_ROLE_KEY rotation completed successfully!"
```

## RLS Policy Security Review

### Current Security Measures

Our enhanced RLS policies implement:

1. **Least-Privilege Access**: Users can only access their own data
2. **Role-Based Controls**: Admin/moderator functions are properly restricted
3. **Secure Functions**: SECURITY DEFINER functions prevent RLS recursion
4. **Audit Logging**: All security events are logged
5. **Service Role Bypass**: System operations work without exposing user data

### Policy Review Checklist

- [ ] Users can only view their own profiles
- [ ] Users cannot escalate their own roles
- [ ] Claims are properly isolated by ownership
- [ ] Moderators have appropriate access levels
- [ ] Activity logs preserve audit trails
- [ ] Service role has necessary permissions
- [ ] Anonymous users have minimal access

### Testing RLS Policies

```sql
-- Test user isolation
SET ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"user1-id"}', true);
SELECT * FROM users; -- Should only return user1's data

-- Test admin access
SELECT set_config('request.jwt.claims', '{"sub":"admin-id"}', true);
SELECT * FROM users; -- Should return all users if admin role

-- Test claim ownership
SELECT set_config('request.jwt.claims', '{"sub":"user2-id"}', true);
SELECT * FROM claims WHERE user_id != 'user2-id'; -- Should return empty
```

## Security Monitoring Queries

### Detect Unusual Access Patterns

```sql
-- Failed authentication attempts
SELECT
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as failed_attempts
FROM activity_log
WHERE description LIKE '%authentication failed%'
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;

-- Service role usage monitoring
SELECT
  DATE_TRUNC('day', created_at) as day,
  entity_type,
  COUNT(*) as operations
FROM activity_log
WHERE user_id IS NULL -- Service role operations
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY day, entity_type
ORDER BY day DESC, operations DESC;
```

## Compliance Requirements

### Data Protection

- Implement proper key rotation schedules
- Maintain audit logs for key usage
- Encrypt keys at rest and in transit
- Document access controls

### Industry Standards

- SOC 2 Type II compliance
- GDPR data protection requirements
- HIPAA security standards (if applicable)
- PCI DSS (if handling payments)

## Troubleshooting

### Common Issues

1. **"Invalid JWT" Errors**:
   - Check key format and completeness
   - Verify environment variable loading
   - Ensure no extra whitespace in key

2. **"Insufficient Privileges" Errors**:
   - Verify RLS policies allow the operation
   - Check user role assignments
   - Review service role permissions

3. **Connection Failures**:
   - Validate Supabase URL and key pair
   - Check network connectivity
   - Review firewall settings

### Debug Commands

```bash
# Verify environment variables
env | grep SUPABASE

# Test database connection
node -e "
const { createClient } = require('@supabase/supabase-js');
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
client.from('users').select('count').then(console.log);
"

# Check RLS policies
psql "$DATABASE_URL" -c "SELECT tablename, policyname, permissive FROM pg_policies WHERE schemaname = 'public';"
```

## Additional Resources

- [Supabase Security Guide](https://supabase.com/docs/guides/auth/security)
- [RLS Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Security Checklist](https://supabase.com/docs/guides/database/security)
- [API Security Standards](https://supabase.com/docs/guides/api/security)

---

**Last Updated**: 2025-08-11  
**Next Review**: 2025-11-11  
**Review Frequency**: Quarterly
