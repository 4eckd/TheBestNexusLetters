# Supabase Backend Setup Guide

This guide covers the complete setup and management of the Supabase backend for your Next.js application.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Database Schema](#database-schema)
- [Row Level Security](#row-level-security)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [API Usage](#api-usage)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Our Supabase backend provides:

- **PostgreSQL Database** with three main tables: Users, Claims, and ActivityLog
- **Row Level Security (RLS)** with least-privilege access policies
- **Real-time subscriptions** for live updates
- **TypeScript integration** with auto-generated types
- **Authentication system** with social logins and email/password
- **File storage** for claim attachments
- **Edge functions** for server-side logic

### Architecture

```
├── supabase/
│   ├── config.toml          # Supabase project configuration
│   ├── migrations/          # Auto-generated migration files
│   └── sql/                 # Version-controlled SQL files
│       ├── 001_initial_schema.sql
│       └── 002_seed_data.sql
├── src/lib/
│   ├── supabase.ts         # Supabase client configuration
│   ├── database.types.ts   # Auto-generated TypeScript types
│   └── database-helpers.ts # Helper functions for database operations
└── docs/
    ├── env.md              # Environment variables guide
    └── supabase-setup.md   # This file
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install Supabase packages
npm install @supabase/supabase-js
npm install -D supabase
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Initialize Local Database

```bash
# Set up the entire database with schema and seed data
npm run db:setup
```

This command will:
1. Start Supabase local services
2. Create database schema
3. Insert seed data
4. Generate TypeScript types

### 4. Start Development

```bash
npm run dev
```

Your application will be available at:
- **Next.js app**: http://localhost:3000
- **Supabase Studio**: http://localhost:54323

---

## 🗄️ Database Schema

### Users Table

Stores user accounts and profiles.

```sql
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
```

**Roles**: `admin`, `moderator`, `user`, `guest`

### Claims Table

Stores insurance/warranty claims submitted by users.

```sql
CREATE TABLE public.claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
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
```

**Claim Types**: `insurance`, `warranty`, `return`, `refund`, `compensation`, `other`
**Statuses**: `pending`, `approved`, `rejected`, `under_review`

### Activity Log Table

Audit trail for all system activities.

```sql
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  activity_type activity_type NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  session_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔒 Row Level Security

All tables have RLS enabled with least-privilege access policies:

### Users Table Policies

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );
```

### Claims Table Policies

```sql
-- Users can view their own claims
CREATE POLICY "Users can view own claims" ON claims
  FOR SELECT USING (user_id = auth.uid());

-- Users can create their own claims
CREATE POLICY "Users can create own claims" ON claims
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admins and moderators can view all claims
CREATE POLICY "Admins and moderators can view all claims" ON claims
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );
```

### Activity Log Policies

```sql
-- Users can view their own activity
CREATE POLICY "Users can view own activity" ON activity_log
  FOR SELECT USING (user_id = auth.uid());

-- Insert-only for authenticated users
CREATE POLICY "Activity log is insert only" ON activity_log
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

---

## 💻 Local Development

### Starting Local Services

```bash
# Start all Supabase services
npm run supabase:start

# Stop all services
npm run supabase:stop

# Reset database (destructive)
npm run supabase:reset
```

### Database Management

```bash
# Apply schema changes
npm run supabase:migrate

# Generate TypeScript types
npm run db:types

# Full database setup (schema + seed data)
npm run db:setup
```

### Working with Migrations

```bash
# Create a new migration
supabase migration new "add_new_feature"

# Apply migrations to local database
supabase db reset

# Generate migration from remote changes
supabase db diff --use-migra > supabase/migrations/new_changes.sql
```

---

## 🌐 Production Deployment

### 1. Create Supabase Project

1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Wait for database provisioning

### 2. Configure Environment Variables

Set these variables in your hosting platform:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Apply Database Schema

```bash
# Link your local project to production
supabase link --project-ref your-project-id

# Apply migrations to production
supabase db push
```

### 4. Security Configuration

1. **Configure Auth Settings** in Supabase Dashboard
2. **Set up Custom Domains** for production
3. **Configure CORS** for your production domain
4. **Review RLS Policies** and test with different user roles

---

## 🔌 API Usage

### Client-Side Operations

```typescript
import { supabase } from '@/lib/supabase';

// Fetch user's claims
const { data: claims, error } = await supabase
  .from('claims')
  .select('*')
  .eq('user_id', userId);

// Create a new claim
const { data, error } = await supabase
  .from('claims')
  .insert({
    title: 'New Claim',
    claim_type: 'warranty',
    user_id: userId
  });
```

### Server-Side Operations

```typescript
import { createServerClient } from '@/lib/supabase';

// In API routes or Server Components
export async function GET() {
  const supabase = createServerClient();
  
  const { data: users, error } = await supabase
    .from('users')
    .select('*');
    
  return Response.json(users);
}
```

### Using Database Helpers

```typescript
import { userHelpers, claimHelpers } from '@/lib/database-helpers';

// Get user by ID
const user = await userHelpers.getById(userId);

// Create a claim
const claim = await claimHelpers.create({
  title: 'New Claim',
  claim_type: 'warranty',
  user_id: userId
});

// Get user's claims with pagination
const { claims, total } = await claimHelpers.getUserClaims(userId, {
  page: 1,
  limit: 10,
  status: 'pending'
});
```

### Real-time Subscriptions

```typescript
// Subscribe to claims updates
const subscription = supabase
  .channel('claims')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'claims',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('Claim updated:', payload);
    // Update UI state
  })
  .subscribe();

// Cleanup
return () => {
  subscription.unsubscribe();
};
```

---

## 🔧 Troubleshooting

### Common Issues

#### "Missing environment variables"
- Ensure `.env.local` exists with all required variables
- Restart your development server after adding variables

#### "Unauthorized" or RLS policy violations
- Check if user is authenticated: `supabase.auth.getUser()`
- Verify RLS policies allow the operation
- Test policies in Supabase Studio

#### Local database connection issues
- Ensure Docker is running
- Check if ports 54321-54324 are available
- Try: `supabase stop && supabase start`

#### Migration errors
- Check SQL syntax in migration files
- Ensure migrations are applied in order
- Review foreign key constraints

### Debug Commands

```bash
# Check Supabase status
supabase status

# View logs
supabase logs

# Test database connection
supabase db ping

# Validate migrations
supabase migration list
```

### Performance Optimization

1. **Add database indexes** for frequently queried columns
2. **Use pagination** for large datasets
3. **Implement caching** for static data
4. **Optimize RLS policies** to avoid unnecessary joins

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Database Design Best Practices](https://supabase.com/docs/guides/database/database-design)

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Maintainer:** Development Team
