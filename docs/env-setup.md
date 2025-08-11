# Environment Setup Migration Guide

This document provides migration instructions for updating environment variable configuration to support the new BNSL alias functionality.

## 🔄 Migration Note

### BNSL Environment Variable Support (January 2025)

The application now includes automatic fallback support for BNSL-prefixed environment variables. This change enhances compatibility for projects that have existing BNSL-prefixed Supabase configurations.

#### What Changed

- Added automatic detection and fallback for BNSL-prefixed variables
- Environment validation now supports both standard and BNSL variable naming conventions
- Console warnings are displayed when fallback variables are used

#### Required Actions

**No immediate action required** - existing configurations will continue to work without changes.

#### Optional Migration Steps

If you have BNSL-prefixed variables and want to standardize:

1. **Option A: Keep BNSL variables as fallbacks (Recommended)**

   ```bash
   # Standard variables (preferred)
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # BNSL variables (fallback - optional to keep)
   BNSL_NEXT_PUBLIC_SUPABASE_URL=your-bnsl-project-url.supabase.co
   BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY=your-bnsl-anon-key
   BNSL_SUPABASE_SERVICE_ROLE_KEY=your-bnsl-service-role-key
   ```

2. **Option B: Use explicit aliases**
   ```bash
   # Create aliases in .env.local
   NEXT_PUBLIC_SUPABASE_URL=${BNSL_NEXT_PUBLIC_SUPABASE_URL}
   NEXT_PUBLIC_SUPABASE_ANON_KEY=${BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY}
   SUPABASE_SERVICE_ROLE_KEY=${BNSL_SUPABASE_SERVICE_ROLE_KEY}
   ```

#### Affected Variables

The following BNSL variables are now automatically detected as fallbacks:

- `BNSL_NEXT_PUBLIC_SUPABASE_URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `BNSL_SUPABASE_SERVICE_ROLE_KEY` → `SUPABASE_SERVICE_ROLE_KEY`

#### Console Messages

When fallback variables are used, you'll see warning messages like:

```
🔄 Using Supabase URL fallback: BNSL_NEXT_PUBLIC_SUPABASE_URL → NEXT_PUBLIC_SUPABASE_URL
✅ Environment variables validated with 3 BNSL fallback(s) (development)
```

These warnings are informational and help track which variables are being used.

## 📚 Additional Resources

- [Complete Environment Variables Documentation](./env.md)
- [Supabase Setup Guide](./supabase-setup.md)
- [Development Setup](./DEVELOPMENT.md)

---

**Last Updated:** January 2025  
**Migration Version:** 1.0  
**Compatibility:** Backwards compatible
