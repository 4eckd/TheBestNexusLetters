/**
 * Environment variable validation using Zod
 * Validates all environment variables at build time
 */

import { z } from 'zod';

/**
 * Helper function to resolve environment variables with fallback support
 * Returns the primary key value if available, otherwise returns the alternative key value
 * @param env - Environment variables object
 * @param key - Primary environment variable key
 * @param altKey - Alternative environment variable key (BNSL-prefixed)
 * @returns The resolved value or undefined
 */
function resolveEnv(
  env: Record<string, string | undefined>,
  key: string,
  altKey: string
): string | undefined {
  return env[key] ?? env[altKey];
}

// Define the schema for environment variables
const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Application configuration
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_TELEMETRY_DISABLED: z.string().optional(),

  // Supabase configuration (will use BNSL fallbacks if not present)
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_DB_PASSWORD: z.string().optional(),

  // Alternative Supabase environment variables (BNSL prefixed)
  BNSL_NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  BNSL_SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Authentication
  NEXTAUTH_SECRET: z.string().optional(),
  JWT_SECRET: z.string().optional(),

  // Email service
  EMAIL_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),

  // Discourse integration
  DISCOURSE_BASE_URL: z.string().url().optional(),
  DISCOURSE_SSO_SECRET: z.string().optional(),
  DISCOURSE_CONNECT_NAME: z.string().optional(),

  // Infuze.cloud deployment
  INFUZE_API_KEY: z.string().optional(),
  INFUZE_PROJECT_ID: z.string().optional(),
  INFUZE_REGION: z.string().optional(),
  INFUZE_ENVIRONMENT: z.string().optional(),
  INFUZE_SERVER_IP: z.string().optional(),
  INFUZE_SSH_KEY_PATH: z.string().optional(),

  // Analytics
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),

  // Development flags
  DEBUG: z.string().optional(),
  ANALYZE: z.string().optional(),
});

// Environment-specific validation - production requirements handled post-parsing
const productionEnvSchema = envSchema;

/**
 * Validate environment variables with BNSL fallback support
 * @param env - Environment variables object (defaults to process.env)
 * @returns Validated environment variables with injected fallback values
 * @throws Error if validation fails
 */
export function validateEnv(env = process.env) {
  const isProduction = env.NODE_ENV === 'production';
  const isBuild =
    process.env.NODE_ENV === undefined ||
    process.env.npm_lifecycle_event === 'build';

  try {
    // Parse with the base schema first
    const validated = envSchema.parse(env);

    // Apply BNSL fallbacks and track which ones were used
    const fallbacksUsed: string[] = [];

    // Helper to apply fallback with tracking
    function applyFallback<T extends keyof typeof validated>(
      primaryKey: T,
      fallbackKey: keyof typeof validated,
      displayName: string
    ) {
      if (!validated[primaryKey] && validated[fallbackKey]) {
        (validated[primaryKey] as any) = validated[fallbackKey];
        fallbacksUsed.push(`${String(primaryKey)} ← ${String(fallbackKey)}`);
        console.warn(
          `🔄 Using ${displayName} fallback: ${String(fallbackKey)} → ${String(primaryKey)}`
        );
      }
    }

    // Apply Supabase fallbacks
    applyFallback(
      'NEXT_PUBLIC_SUPABASE_URL',
      'BNSL_NEXT_PUBLIC_SUPABASE_URL',
      'Supabase URL'
    );
    applyFallback(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'Supabase Anon Key'
    );
    applyFallback(
      'SUPABASE_SERVICE_ROLE_KEY',
      'BNSL_SUPABASE_SERVICE_ROLE_KEY',
      'Supabase Service Role Key'
    );

    // Production-specific validation and requirements
    if (isProduction || isBuild) {
      const errors: string[] = [];

      // Check required Supabase variables (after fallbacks)
      const supabaseUrl = validated.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = validated.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const supabaseServiceKey = validated.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl) {
        errors.push(
          'NEXT_PUBLIC_SUPABASE_URL is required (no BNSL fallback found)'
        );
      } else {
        // Validate URL format
        try {
          const url = new URL(supabaseUrl);
          if (
            supabaseUrl.includes('your-project-url') ||
            supabaseUrl.includes('mock-supabase-url')
          ) {
            errors.push(
              'NEXT_PUBLIC_SUPABASE_URL must not be a placeholder value in production'
            );
          }
        } catch {
          errors.push('NEXT_PUBLIC_SUPABASE_URL must be a valid URL');
        }
      }

      if (!supabaseAnonKey) {
        errors.push(
          'NEXT_PUBLIC_SUPABASE_ANON_KEY is required (no BNSL fallback found)'
        );
      } else if (
        supabaseAnonKey.length < 100 ||
        supabaseAnonKey.includes('your-anon-key') ||
        supabaseAnonKey.match(/^\*+$/)
      ) {
        errors.push(
          'NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid or a placeholder value'
        );
      }

      if (!supabaseServiceKey) {
        errors.push(
          'SUPABASE_SERVICE_ROLE_KEY is required (no BNSL fallback found)'
        );
      } else if (
        supabaseServiceKey.length < 100 ||
        supabaseServiceKey.includes('your-service-role-key')
      ) {
        errors.push(
          'SUPABASE_SERVICE_ROLE_KEY appears to be invalid or a placeholder value'
        );
      }

      if (errors.length > 0) {
        console.error('❌ Production environment validation failed:');
        errors.forEach(error => console.error(`  - ${error}`));
        console.error(
          '\n💥 Build failed due to missing or invalid required environment variables.'
        );
        console.error(
          'Please check your .env files and ensure all required Supabase variables are set correctly.\n'
        );
        process.exit(1);
      }
    }

    // Log successful validation
    if (fallbacksUsed.length > 0) {
      console.log(
        `✅ Environment variables validated with ${fallbacksUsed.length} BNSL fallback(s) (${env.NODE_ENV || 'development'})`
      );
    } else {
      console.log(
        `✅ Environment variables validated successfully (${env.NODE_ENV || 'development'})`
      );
    }

    // Additional production-specific security checks
    if (isProduction) {
      const serviceRoleKey = validated.SUPABASE_SERVICE_ROLE_KEY;
      if (serviceRoleKey && serviceRoleKey.length < 200) {
        console.warn(
          '⚠️  SERVICE_ROLE_KEY appears to be short. Consider rotating it for security.'
        );
      }

      const supabaseUrl = validated.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) {
        const url = new URL(supabaseUrl);
        if (
          !url.hostname.endsWith('.supabase.co') &&
          !url.hostname.endsWith('.supabase.in')
        ) {
          console.warn(
            '⚠️  Supabase URL domain may need to be added to CSP headers'
          );
        }
      }
    }

    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment variable validation failed:');
      if (error.issues && Array.isArray(error.issues)) {
        error.issues.forEach(err => {
          console.error(`  - ${err.path.join('.')}: ${err.message}`);
        });
      } else {
        console.error(
          '  - Validation error occurred but details are not available'
        );
      }

      // In build mode or production, fail the build
      if (isBuild || isProduction) {
        console.error(
          '\n💥 Build failed due to environment variable validation errors.'
        );
        console.error(
          'Please check your .env files and ensure all required variables are set correctly.\n'
        );
        process.exit(1);
      }
    } else {
      // Generic fallback for non-Zod errors
      console.error('❌ Environment validation failed with unknown error');
    }
    throw error;
  }
}

// Export the validated environment variables for use throughout the app
export const env = validateEnv();

// Export the helper function for external use
export { resolveEnv };

// Type for the validated environment
export type Env = z.infer<typeof envSchema>;
