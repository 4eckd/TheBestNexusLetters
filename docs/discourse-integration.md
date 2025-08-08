# Discourse Community Forum Integration

This document describes the integration between your Next.js application and Discourse community forums using Single Sign-On (SSO) via Supabase JWT authentication.

## Overview

The integration provides:
- **Seamless SSO authentication** between your app and Discourse
- **Deep-linking to forum categories** with automatic authentication
- **User role synchronization** (admin/moderator status)
- **Secure HMAC-based authentication** following Discourse standards

## Architecture

```
┌─────────────────┐    SSO Request    ┌─────────────────┐
│                 │◄─────────────────►│                 │
│   Next.js App   │                   │   Discourse     │
│   (Supabase)    │    User Info      │     Forum       │
│                 │◄─────────────────►│                 │
└─────────────────┘                   └─────────────────┘
```

## Setup Instructions

### 1. Environment Configuration

Add the following environment variables to your `.env.local`:

```env
# Discourse Configuration
DISCOURSE_BASE_URL=https://your-discourse-forum.com
DISCOURSE_SSO_SECRET=your-sso-secret-key
DISCOURSE_CONNECT_NAME=YourAppName

# Optional: Public URL for client-side components
NEXT_PUBLIC_DISCOURSE_BASE_URL=https://your-discourse-forum.com
```

### 2. Discourse Forum Setup

1. **Enable SSO in Discourse Admin**:
   - Go to Admin → Settings → Login
   - Enable "enable sso"
   - Set "sso url" to: `https://yourdomain.com/api/discourse/sso`
   - Generate and set "sso secret" (match with `DISCOURSE_SSO_SECRET`)

2. **Configure SSO Settings**:
   - Enable "sso overrides email" (recommended)
   - Enable "sso overrides username" (recommended)
   - Enable "sso overrides name" (recommended)
   - Disable "enable local logins" if you want SSO-only

3. **Category Setup** (optional):
   - Create categories that match your app's context
   - Configure permissions as needed
   - Note category slugs for deep-linking

### 3. User Role Mapping

The integration maps Supabase user roles to Discourse permissions:

| Supabase Role | Discourse Permission |
|---------------|----------------------|
| `admin`       | Administrator        |
| `moderator`   | Moderator           |
| `user`        | Regular User        |

## API Endpoints

### `/api/discourse/sso`

**Primary SSO endpoint** that handles authentication between Discourse and your app.

#### GET Request Flow:
1. Discourse redirects user to this endpoint with SSO parameters
2. Endpoint validates the request signature
3. Retrieves user information from Supabase
4. Generates SSO response with user data
5. Redirects back to Discourse with authenticated session

#### Parameters:
- `sso`: Base64-encoded SSO payload from Discourse
- `sig`: HMAC-SHA256 signature of the payload

#### Response:
- **Success**: Redirects to Discourse with valid SSO response
- **Error**: Returns JSON error response

## Components

### CommunityLink Component

Provides deep-linking to Discourse forum categories with automatic SSO authentication.

#### Basic Usage:

```tsx
import { CommunityLink } from '@/components/ui/community-link';

// Single category link
<CommunityLink 
  category="general" 
  linkText="Join Discussion" 
/>

// Category grid
<CommunityLink 
  mode="grid" 
  categories={customCategories} 
/>

// Category list
<CommunityLink 
  mode="list" 
  className="max-w-md" 
/>
```

#### Props:

| Prop | Type | Description |
|------|------|-------------|
| `category` | `string` | Category slug to link to (for single mode) |
| `categories` | `DiscourseCategory[]` | Custom categories array |
| `mode` | `'single' \| 'grid' \| 'list'` | Display mode |
| `className` | `string` | Custom CSS classes |
| `linkText` | `string` | Custom link text (single mode) |
| `showExternalIcon` | `boolean` | Show external link icon |
| `openInNewTab` | `boolean` | Open links in new tab |
| `forumUrl` | `string` | Custom forum URL override |

#### Custom Categories:

```tsx
import { DiscourseCategory } from '@/components/ui/community-link';

const customCategories: DiscourseCategory[] = [
  {
    id: 'support',
    name: 'Get Help',
    slug: 'support',
    description: 'Technical support and troubleshooting',
    icon: HelpCircle,
    color: 'text-red-600'
  }
];
```

## Utility Functions

### Discourse Library (`@/lib/discourse`)

#### Key Functions:

- `generateHMAC(payload, secret)` - Generate HMAC signature
- `validateHMAC(payload, signature, secret)` - Validate HMAC signature
- `encodeSSO(params)` - Encode SSO parameters for Discourse
- `decodeSSO(payload)` - Decode SSO payload from Discourse
- `buildCategoryUrl(slug, enableSSO)` - Build category URL with optional SSO
- `buildTopicUrl(topicId, enableSSO)` - Build topic URL with optional SSO
- `isDiscourseConfigured()` - Check if integration is configured
- `userToDiscourseSSO(user, nonce)` - Convert Supabase user to Discourse format

#### Example Usage:

```tsx
import { buildCategoryUrl, isDiscourseConfigured } from '@/lib/discourse';

// Check if Discourse is configured
if (isDiscourseConfigured()) {
  // Build category URL with SSO
  const url = buildCategoryUrl('general', true);
  
  // Redirect user
  window.location.href = url;
}
```

## Security Considerations

1. **Environment Variables**: Store sensitive keys (SSO secret) in server-side environment variables only
2. **HMAC Validation**: All requests are validated using constant-time comparison to prevent timing attacks
3. **HTTPS Only**: Ensure both your app and Discourse forum use HTTPS in production
4. **Secret Rotation**: Regularly rotate your SSO secret and update both systems

## Testing

### Local Development:

1. Set up a local or staging Discourse instance
2. Configure SSO with your local development URL
3. Test the authentication flow:
   ```bash
   # Start your Next.js app
   npm run dev
   
   # Visit your forum and attempt to login
   # Should redirect to your app for authentication
   ```

### Integration Testing:

```bash
# Test SSO endpoint directly
curl "http://localhost:3000/api/discourse/sso?sso=BASE64_PAYLOAD&sig=HMAC_SIGNATURE"
```

## Troubleshooting

### Common Issues:

1. **"Invalid signature" errors**:
   - Verify `DISCOURSE_SSO_SECRET` matches in both systems
   - Check that the secret contains no extra whitespace
   - Ensure Discourse and your app are using the same secret

2. **"Discourse SSO not properly configured"**:
   - Verify all required environment variables are set
   - Check that `DISCOURSE_BASE_URL` is accessible
   - Ensure URL format is correct (with protocol, without trailing slash)

3. **Authentication loops**:
   - Verify Supabase user authentication is working
   - Check that the API route can access user sessions
   - Ensure user has required email field

4. **User role sync issues**:
   - Verify user role is stored correctly in Supabase
   - Check database schema matches expected role values
   - Ensure API route has access to user roles table

### Debug Mode:

Enable debug logging by setting:
```env
DEBUG=true
```

This will log SSO request/response details to help diagnose issues.

## Production Deployment

### Checklist:

- [ ] Environment variables configured on production server
- [ ] HTTPS enabled on both app and Discourse
- [ ] SSO secret is secure and randomly generated
- [ ] Discourse SSO URL points to production endpoint
- [ ] Categories configured and accessible
- [ ] User role synchronization tested
- [ ] Error handling and logging implemented

### Monitoring:

Monitor the `/api/discourse/sso` endpoint for:
- Authentication success/failure rates
- Response times
- Error patterns
- User role distribution

## Advanced Configuration

### Custom User Mapping:

Modify the SSO response to include additional user fields:

```tsx
// In /api/discourse/sso/route.ts
const ssoResponseParams = {
  external_id: user.id,
  email: user.email,
  username: user.user_metadata?.username || user.email.split('@')[0],
  name: user.user_metadata?.name || 'User',
  // Add custom fields
  bio: user.user_metadata?.bio,
  avatar_url: user.user_metadata?.avatar_url,
  // Custom groups/badges
  custom_fields: JSON.stringify({
    subscription_type: user.user_metadata?.subscription_type,
    join_date: user.created_at,
  }),
};
```

### Multiple Forum Support:

To support multiple Discourse instances, modify the configuration:

```tsx
const DISCOURSE_CONFIGS = {
  main: {
    baseUrl: process.env.DISCOURSE_MAIN_URL,
    secret: process.env.DISCOURSE_MAIN_SECRET,
  },
  support: {
    baseUrl: process.env.DISCOURSE_SUPPORT_URL,
    secret: process.env.DISCOURSE_SUPPORT_SECRET,
  },
};
```

## Support

For issues related to:
- **Discourse setup**: Consult [Discourse SSO Documentation](https://meta.discourse.org/t/discourseconnect-official-single-sign-on-for-discourse-sso/13045)
- **Supabase integration**: Check [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- **Next.js API routes**: Reference [Next.js Documentation](https://nextjs.org/docs/api-routes/introduction)

## References

- [Discourse SSO Protocol](https://meta.discourse.org/t/discourseconnect-official-single-sign-on-for-discourse-sso/13045)
- [HMAC-SHA256 Specification](https://tools.ietf.org/html/rfc2104)
- [Supabase User Management](https://supabase.com/docs/guides/auth/managing-user-data)
