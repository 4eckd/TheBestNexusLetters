# Environment Variables Documentation

This document outlines all the environment variables required for the Supabase backend integration and proper application configuration.

## 📋 Table of Contents

- [Quick Setup](#quick-setup)
- [Required Variables](#required-variables)
- [Optional Variables](#optional-variables)
- [Environment File Setup](#environment-file-setup)
- [Security Guidelines](#security-guidelines)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Setup

1. Copy the `.env.example` file to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase project details from your [Supabase Dashboard](https://supabase.com/dashboard)

3. Restart your development server after making changes

---

## 🔑 Required Variables

### Supabase Configuration

These variables are **required** for the application to function properly:

| Variable                        | Description                                         | Where to Find                         | Example                                   |
| ------------------------------- | --------------------------------------------------- | ------------------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL                           | Project Settings → API                | `https://xxxxxxxxxxxxx.supabase.co`       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key for client-side operations     | Project Settings → API → anon/public  | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY`     | Private service role key for server-side operations | Project Settings → API → service_role | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

#### BNSL-Prefixed Variables Support

The application automatically supports fallback to BNSL-prefixed environment variables. If you have variables with the `BNSL_` prefix, they will be used automatically when the standard variables are not available:

| Standard Variable               | BNSL Fallback                        | Fallback Behavior               |
| ------------------------------- | ------------------------------------ | ------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `BNSL_NEXT_PUBLIC_SUPABASE_URL`      | Automatic fallback with warning |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY` | Automatic fallback with warning |
| `SUPABASE_SERVICE_ROLE_KEY`     | `BNSL_SUPABASE_SERVICE_ROLE_KEY`     | Automatic fallback with warning |

**⚠️ Fallback Warnings:** When fallback variables are used, the system will log which BNSL variables are being used, helping developers understand their configuration.

### Application Configuration

| Variable              | Description                  | Default                 | Example                                 |
| --------------------- | ---------------------------- | ----------------------- | --------------------------------------- |
| `NEXT_PUBLIC_APP_URL` | Base URL of your application | `http://localhost:3000` | `https://yourdomain.com`                |
| `NODE_ENV`            | Application environment      | `development`           | `development` \| `production` \| `test` |

---

## ⚙️ Optional Variables

### Database Configuration

| Variable               | Description                              | Required When                        | Example                               |
| ---------------------- | ---------------------------------------- | ------------------------------------ | ------------------------------------- |
| `SUPABASE_DB_PASSWORD` | Database password for direct connections | Using database migrations or backups | `your-secure-password`                |
| `DATABASE_URL`         | Full PostgreSQL connection string        | Migrating from other databases       | `postgresql://user:pass@host:port/db` |

### Authentication & Security

| Variable          | Description            | Required When              | Example                                  |
| ----------------- | ---------------------- | -------------------------- | ---------------------------------------- |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Using NextAuth.js          | Generate with: `openssl rand -base64 32` |
| `JWT_SECRET`      | Custom JWT secret      | Custom auth implementation | `your-jwt-secret-here`                   |

### External Services

| Variable        | Description           | Required When               | Example                  |
| --------------- | --------------------- | --------------------------- | ------------------------ |
| `EMAIL_API_KEY` | Email service API key | Email notifications enabled | `SG.xxxxxxxxxxxxxxxx`    |
| `EMAIL_FROM`    | Default sender email  | Email notifications enabled | `noreply@yourdomain.com` |

### File Storage

| Variable                | Description    | Required When                 | Example                                    |
| ----------------------- | -------------- | ----------------------------- | ------------------------------------------ |
| `AWS_ACCESS_KEY_ID`     | AWS access key | Using AWS S3 for file storage | `AKIAIOSFODNN7EXAMPLE`                     |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Using AWS S3 for file storage | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION`            | AWS region     | Using AWS S3 for file storage | `us-east-1`                                |
| `AWS_S3_BUCKET`         | S3 bucket name | Using AWS S3 for file storage | `your-bucket-name`                         |

### Analytics & Monitoring

| Variable            | Description                  | Required When          | Example                              |
| ------------------- | ---------------------------- | ---------------------- | ------------------------------------ |
| `NEXT_PUBLIC_GA_ID` | Google Analytics tracking ID | Analytics enabled      | `G-XXXXXXXXXX`                       |
| `SENTRY_DSN`        | Sentry error monitoring DSN  | Error tracking enabled | `https://xxxxxxxx@sentry.io/xxxxxxx` |

---

## 📁 Environment File Setup

### BNSL Variable Configuration Options

The application supports two approaches for handling BNSL-prefixed Supabase variables:

#### Option A: Automatic Fallback (Default - Recommended)

The environment validation system automatically detects and uses BNSL-prefixed variables as fallbacks. No additional configuration required.

```bash
# Standard variables (preferred)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# BNSL variables (automatic fallback if standard ones missing)
BNSL_NEXT_PUBLIC_SUPABASE_URL=https://bnsl-project.supabase.co
BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY=bnsl-anon-key
BNSL_SUPABASE_SERVICE_ROLE_KEY=bnsl-service-role-key
```

**Benefits:**

- Zero configuration required
- Clear console warnings when fallbacks are used
- Maintains compatibility with CI/CD environments
- Easy to identify which variables are being used

#### Option B: Explicit Aliases

Manually create aliases in your `.env.local` file:

```bash
# Explicit aliases (uncomment to use)
NEXT_PUBLIC_SUPABASE_URL=${BNSL_NEXT_PUBLIC_SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${BNSL_SUPABASE_SERVICE_ROLE_KEY}

# BNSL source variables
BNSL_NEXT_PUBLIC_SUPABASE_URL=https://bnsl-project.supabase.co
BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY=bnsl-anon-key
BNSL_SUPABASE_SERVICE_ROLE_KEY=bnsl-service-role-key
```

**Benefits:**

- Explicit configuration
- No runtime warnings
- Traditional environment variable syntax

### Development Environment

Create `.env.local` for your local development:

```bash
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional
DEBUG=true
NEXT_TELEMETRY_DISABLED=1
```

### Production Environment

For production deployments (Vercel, Netlify, etc.), set these in your hosting platform's environment variables section:

**Required for Production:**

- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Recommended for Production:**

- `NEXTAUTH_SECRET` (if using NextAuth.js)
- `SENTRY_DSN` (for error monitoring)
- Email service configuration (for notifications)

---

## 🔒 Security Guidelines

### ⚠️ Critical Security Notes

1. **Never commit `.env.local` or any `.env*` files** (except `.env.example`)
2. **Service Role Key is sensitive** - only use server-side, never expose to client
3. **Rotate keys regularly** - especially if compromised
4. **Use different keys** for development and production environments

### 🔐 Key Permissions

| Key Type                        | Client-Side  | Server-Side | Permissions             |
| ------------------------------- | ------------ | ----------- | ----------------------- |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes       | ✅ Yes      | Limited by RLS policies |
| `SUPABASE_SERVICE_ROLE_KEY`     | ❌ **NEVER** | ✅ Yes      | Full database access    |

### 🛡️ Best Practices

- Use environment-specific Supabase projects (dev/staging/prod)
- Enable Row Level Security (RLS) on all tables
- Regularly audit API key usage in Supabase Dashboard
- Set up proper CORS policies for production domains
- Use Supabase Edge Functions for sensitive operations

---

## 🔧 Troubleshooting

### Common Issues

#### "Missing Supabase environment variables"

**Problem:** Application fails to start with environment variable errors.

**Solution:**

1. Ensure `.env.local` exists and contains required variables
2. Restart your development server after adding variables
3. Check for typos in variable names (case-sensitive)

#### "Invalid API key" or "Unauthorized" errors

**Problem:** Authentication fails with Supabase.

**Solution:**

1. Verify keys in Supabase Dashboard → Project Settings → API
2. Ensure you're using the correct project URL
3. Check if keys have been regenerated in Supabase

#### RLS Policy Errors

**Problem:** Database queries fail with policy violations.

**Solution:**

1. Ensure RLS policies are properly configured
2. Check if user is authenticated before making requests
3. Verify policy conditions match your use case

#### BNSL Variable Fallback Issues

**Problem:** Console shows BNSL fallback warnings or variables not being recognized.

**Solution:**

1. Check console output for fallback messages like: `🔄 Using Supabase URL fallback: BNSL_NEXT_PUBLIC_SUPABASE_URL → NEXT_PUBLIC_SUPABASE_URL`
2. Ensure BNSL variables have the correct `BNSL_` prefix
3. Verify variable names match exactly (case-sensitive)
4. If using Option B, ensure alias syntax is correct: `VAR=${BNSL_VAR}`
5. Restart development server after making environment changes

### Environment-Specific Issues

#### Development

```bash
# Check if variables are loaded
npm run dev

# If variables aren't loading:
1. Restart the development server
2. Check file name is exactly `.env.local`
3. Ensure no trailing spaces in variable names
```

#### Production

```bash
# Verify environment variables are set
echo $NEXT_PUBLIC_SUPABASE_URL

# If deployment fails:
1. Check hosting platform environment variables
2. Ensure all required variables are set
3. Verify no syntax errors in values
```

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Dashboard](https://supabase.com/dashboard)

---

## 🔄 Migration Guide

If migrating from another database provider:

1. Export your existing data
2. Set up new Supabase project
3. Run database migrations: `npm run supabase:migrate`
4. Import your data using Supabase tools
5. Update environment variables
6. Test authentication and RLS policies

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Maintainer:** Development Team
