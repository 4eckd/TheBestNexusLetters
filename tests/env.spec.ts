import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateEnv, resolveEnv } from '../src/lib/env';

describe('Environment Variable Validation', () => {
  let originalConsole: typeof console;
  let mockConsole: {
    log: ReturnType<typeof vi.fn>;
    warn: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };
  let originalProcessExit: typeof process.exit;

  beforeEach(() => {
    // Mock console methods to capture logging
    originalConsole = console;
    mockConsole = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    global.console = { ...console, ...mockConsole };

    // Mock process.exit to prevent actual exits during tests
    originalProcessExit = process.exit;
    process.exit = vi.fn() as any;
  });

  afterEach(() => {
    // Restore original console and process.exit
    global.console = originalConsole;
    process.exit = originalProcessExit;
    vi.restoreAllMocks();
  });

  describe('resolveEnv helper function', () => {
    it('should return primary key value when available', () => {
      const env = {
        PRIMARY_KEY: 'primary_value',
        FALLBACK_KEY: 'fallback_value',
      };

      const result = resolveEnv(env, 'PRIMARY_KEY', 'FALLBACK_KEY');
      expect(result).toBe('primary_value');
    });

    it('should return fallback key value when primary is undefined', () => {
      const env = {
        PRIMARY_KEY: undefined,
        FALLBACK_KEY: 'fallback_value',
      };

      const result = resolveEnv(env, 'PRIMARY_KEY', 'FALLBACK_KEY');
      expect(result).toBe('fallback_value');
    });

    it('should return undefined when both keys are undefined', () => {
      const env = {
        PRIMARY_KEY: undefined,
        FALLBACK_KEY: undefined,
      };

      const result = resolveEnv(env, 'PRIMARY_KEY', 'FALLBACK_KEY');
      expect(result).toBeUndefined();
    });

    it('should return fallback when primary is empty string', () => {
      const env = {
        PRIMARY_KEY: '',
        FALLBACK_KEY: 'fallback_value',
      };

      const result = resolveEnv(env, 'PRIMARY_KEY', 'FALLBACK_KEY');
      expect(result).toBe('fallback_value');
    });
  });

  describe('validateEnv with BNSL fallbacks', () => {
    it('should validate successfully with only BNSL-prefixed variables', () => {
      const testEnv = {
        NODE_ENV: 'development',
        BNSL_NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
        BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDk5NTIwMCwiZXhwIjoxOTU2NTcxMjAwfQ.test-anon-key-with-sufficient-length-for-validation',
        BNSL_SUPABASE_SERVICE_ROLE_KEY:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE5NTY1NzEyMDB9.test-service-role-key-with-sufficient-length-for-validation-requirements-to-pass-all-checks',
      };

      const result = validateEnv(testEnv);

      expect(result).toBeDefined();
      expect(result.NEXT_PUBLIC_SUPABASE_URL).toBe(
        testEnv.BNSL_NEXT_PUBLIC_SUPABASE_URL
      );
      expect(result.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe(
        testEnv.BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      expect(result.SUPABASE_SERVICE_ROLE_KEY).toBe(
        testEnv.BNSL_SUPABASE_SERVICE_ROLE_KEY
      );

      // Verify fallback warnings were logged
      expect(mockConsole.warn).toHaveBeenCalledWith(
        '🔄 Using Supabase URL fallback: BNSL_NEXT_PUBLIC_SUPABASE_URL → NEXT_PUBLIC_SUPABASE_URL'
      );
      expect(mockConsole.warn).toHaveBeenCalledWith(
        '🔄 Using Supabase Anon Key fallback: BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY → NEXT_PUBLIC_SUPABASE_ANON_KEY'
      );
      expect(mockConsole.warn).toHaveBeenCalledWith(
        '🔄 Using Supabase Service Role Key fallback: BNSL_SUPABASE_SERVICE_ROLE_KEY → SUPABASE_SERVICE_ROLE_KEY'
      );

      // Verify success message
      expect(mockConsole.log).toHaveBeenCalledWith(
        '✅ Environment variables validated with 3 BNSL fallback(s) (development)'
      );
    });

    it('should prefer primary keys over BNSL fallbacks when both are present', () => {
      const testEnv = {
        NODE_ENV: 'development',
        NEXT_PUBLIC_SUPABASE_URL: 'https://primary.supabase.co',
        BNSL_NEXT_PUBLIC_SUPABASE_URL: 'https://fallback.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          'primary-anon-key-with-sufficient-length-for-validation-requirements-to-pass-all-checks-properly',
        BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY: 'fallback-anon-key',
      };

      const result = validateEnv(testEnv);

      expect(result.NEXT_PUBLIC_SUPABASE_URL).toBe(
        'https://primary.supabase.co'
      );
      expect(result.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe(
        testEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      // Should not show fallback warnings since primary keys are used
      expect(mockConsole.warn).not.toHaveBeenCalledWith(
        expect.stringContaining('fallback')
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        '✅ Environment variables validated successfully (development)'
      );
    });

    it('should validate successfully with mixed primary and BNSL variables', () => {
      const testEnv = {
        NODE_ENV: 'test',
        NEXT_PUBLIC_SUPABASE_URL: 'https://primary.supabase.co',
        BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDk5NTIwMCwiZXhwIjoxOTU2NTcxMjAwfQ.test-anon-key-with-sufficient-length-for-validation',
        SUPABASE_SERVICE_ROLE_KEY:
          'primary-service-role-key-with-sufficient-length-for-validation-requirements-to-pass-all-security-checks-properly-and-completely',
      };

      const result = validateEnv(testEnv);

      expect(result.NEXT_PUBLIC_SUPABASE_URL).toBe(
        'https://primary.supabase.co'
      );
      expect(result.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe(
        testEnv.BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      expect(result.SUPABASE_SERVICE_ROLE_KEY).toBe(
        testEnv.SUPABASE_SERVICE_ROLE_KEY
      );

      // Should only warn about the one fallback used
      expect(mockConsole.warn).toHaveBeenCalledWith(
        '🔄 Using Supabase Anon Key fallback: BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY → NEXT_PUBLIC_SUPABASE_ANON_KEY'
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        '✅ Environment variables validated with 1 BNSL fallback(s) (test)'
      );
    });
  });

  describe('validateEnv with invalid placeholders', () => {
    it('should fail validation with placeholder URL in production', () => {
      const testEnv = {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_URL: 'https://your-project-url.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          'valid-anon-key-with-sufficient-length-for-validation-requirements-to-pass-all-checks-properly-and-completely',
        SUPABASE_SERVICE_ROLE_KEY:
          'valid-service-role-key-with-sufficient-length-for-validation-requirements-to-pass-all-security-checks-properly-and-completely',
      };

      expect(() => validateEnv(testEnv)).toThrow();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '❌ Production environment validation failed:'
      );
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - NEXT_PUBLIC_SUPABASE_URL must not be a placeholder value in production'
      );
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should fail validation with mock URL placeholder', () => {
      const testEnv = {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_URL: 'https://mock-supabase-url.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          'valid-anon-key-with-sufficient-length-for-validation-requirements-to-pass-all-checks-properly-and-completely',
        SUPABASE_SERVICE_ROLE_KEY:
          'valid-service-role-key-with-sufficient-length-for-validation-requirements-to-pass-all-security-checks-properly-and-completely',
      };

      expect(() => validateEnv(testEnv)).toThrow();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - NEXT_PUBLIC_SUPABASE_URL must not be a placeholder value in production'
      );
    });

    it('should fail validation with placeholder anon key', () => {
      const testEnv = {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_URL: 'https://valid-project.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your-anon-key',
        SUPABASE_SERVICE_ROLE_KEY:
          'valid-service-role-key-with-sufficient-length-for-validation-requirements-to-pass-all-security-checks-properly-and-completely',
      };

      expect(() => validateEnv(testEnv)).toThrow();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid or a placeholder value'
      );
    });

    it('should fail validation with asterisks placeholder anon key', () => {
      const testEnv = {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_URL: 'https://valid-project.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: '***************',
        SUPABASE_SERVICE_ROLE_KEY:
          'valid-service-role-key-with-sufficient-length-for-validation-requirements-to-pass-all-security-checks-properly-and-completely',
      };

      expect(() => validateEnv(testEnv)).toThrow();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid or a placeholder value'
      );
    });

    it('should fail validation with placeholder service role key', () => {
      const testEnv = {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_URL: 'https://valid-project.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          'valid-anon-key-with-sufficient-length-for-validation-requirements-to-pass-all-checks-properly-and-completely',
        SUPABASE_SERVICE_ROLE_KEY: 'your-service-role-key',
      };

      expect(() => validateEnv(testEnv)).toThrow();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - SUPABASE_SERVICE_ROLE_KEY appears to be invalid or a placeholder value'
      );
    });

    it('should fail validation with short anon key', () => {
      const testEnv = {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_URL: 'https://valid-project.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'short-key',
        SUPABASE_SERVICE_ROLE_KEY:
          'valid-service-role-key-with-sufficient-length-for-validation-requirements-to-pass-all-security-checks-properly-and-completely',
      };

      expect(() => validateEnv(testEnv)).toThrow();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid or a placeholder value'
      );
    });

    it('should fail validation with short service role key', () => {
      const testEnv = {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_URL: 'https://valid-project.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          'valid-anon-key-with-sufficient-length-for-validation-requirements-to-pass-all-checks-properly-and-completely',
        SUPABASE_SERVICE_ROLE_KEY: 'short-service-key',
      };

      expect(() => validateEnv(testEnv)).toThrow();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - SUPABASE_SERVICE_ROLE_KEY appears to be invalid or a placeholder value'
      );
    });

    it('should fail validation with invalid URL format', () => {
      const testEnv = {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_URL: 'not-a-valid-url',
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          'valid-anon-key-with-sufficient-length-for-validation-requirements-to-pass-all-checks-properly-and-completely',
        SUPABASE_SERVICE_ROLE_KEY:
          'valid-service-role-key-with-sufficient-length-for-validation-requirements-to-pass-all-security-checks-properly-and-completely',
      };

      expect(() => validateEnv(testEnv)).toThrow();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - NEXT_PUBLIC_SUPABASE_URL must be a valid URL'
      );
    });

    it('should fail validation when BNSL fallback also contains placeholders', () => {
      const testEnv = {
        NODE_ENV: 'production',
        BNSL_NEXT_PUBLIC_SUPABASE_URL: 'https://your-project-url.supabase.co',
        BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your-anon-key',
        BNSL_SUPABASE_SERVICE_ROLE_KEY: 'your-service-role-key',
      };

      expect(() => validateEnv(testEnv)).toThrow();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '❌ Production environment validation failed:'
      );
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - NEXT_PUBLIC_SUPABASE_URL must not be a placeholder value in production'
      );
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid or a placeholder value'
      );
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - SUPABASE_SERVICE_ROLE_KEY appears to be invalid or a placeholder value'
      );
    });
  });

  describe('validateEnv missing required variables', () => {
    it('should fail when no Supabase URL is provided in production', () => {
      const testEnv = {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          'valid-anon-key-with-sufficient-length-for-validation-requirements-to-pass-all-checks-properly-and-completely',
        SUPABASE_SERVICE_ROLE_KEY:
          'valid-service-role-key-with-sufficient-length-for-validation-requirements-to-pass-all-security-checks-properly-and-completely',
      };

      expect(() => validateEnv(testEnv)).toThrow();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - NEXT_PUBLIC_SUPABASE_URL is required (no BNSL fallback found)'
      );
    });

    it('should fail when no anon key is provided in production', () => {
      const testEnv = {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_URL: 'https://valid-project.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY:
          'valid-service-role-key-with-sufficient-length-for-validation-requirements-to-pass-all-security-checks-properly-and-completely',
      };

      expect(() => validateEnv(testEnv)).toThrow();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - NEXT_PUBLIC_SUPABASE_ANON_KEY is required (no BNSL fallback found)'
      );
    });

    it('should fail when no service role key is provided in production', () => {
      const testEnv = {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_URL: 'https://valid-project.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          'valid-anon-key-with-sufficient-length-for-validation-requirements-to-pass-all-checks-properly-and-completely',
      };

      expect(() => validateEnv(testEnv)).toThrow();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - SUPABASE_SERVICE_ROLE_KEY is required (no BNSL fallback found)'
      );
    });

    it('should accumulate multiple validation errors', () => {
      const testEnv = {
        NODE_ENV: 'production',
      };

      expect(() => validateEnv(testEnv)).toThrow();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '❌ Production environment validation failed:'
      );
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - NEXT_PUBLIC_SUPABASE_URL is required (no BNSL fallback found)'
      );
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - NEXT_PUBLIC_SUPABASE_ANON_KEY is required (no BNSL fallback found)'
      );
      expect(mockConsole.error).toHaveBeenCalledWith(
        '  - SUPABASE_SERVICE_ROLE_KEY is required (no BNSL fallback found)'
      );
      expect(mockConsole.error).toHaveBeenCalledWith(
        '💥 Build failed due to missing or invalid required environment variables.'
      );
    });
  });

  describe('validateEnv build mode behavior', () => {
    it('should treat build mode like production for validation', () => {
      // Mock npm_lifecycle_event to simulate build
      const originalNpmLifecycle = process.env.npm_lifecycle_event;
      process.env.npm_lifecycle_event = 'build';

      const testEnv = {
        NODE_ENV: 'development',
        NEXT_PUBLIC_SUPABASE_URL: 'https://your-project-url.supabase.co',
      };

      try {
        expect(() => validateEnv(testEnv)).toThrow();
        expect(mockConsole.error).toHaveBeenCalledWith(
          '💥 Build failed due to environment variable validation errors.'
        );
      } finally {
        // Restore original environment
        if (originalNpmLifecycle) {
          process.env.npm_lifecycle_event = originalNpmLifecycle;
        } else {
          delete process.env.npm_lifecycle_event;
        }
      }
    });

    it('should treat undefined NODE_ENV as build mode', () => {
      const testEnv = {
        // NODE_ENV is undefined
        NEXT_PUBLIC_SUPABASE_URL: 'https://your-project-url.supabase.co',
      };

      expect(() => validateEnv(testEnv)).toThrow();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '💥 Build failed due to environment variable validation errors.'
      );
    });
  });

  describe('validateEnv development mode behavior', () => {
    it('should allow missing variables in development', () => {
      const testEnv = {
        NODE_ENV: 'development',
      };

      const result = validateEnv(testEnv);
      expect(result).toBeDefined();
      expect(result.NODE_ENV).toBe('development');
      expect(mockConsole.log).toHaveBeenCalledWith(
        '✅ Environment variables validated successfully (development)'
      );
    });

    it('should allow placeholder values in development', () => {
      const testEnv = {
        NODE_ENV: 'development',
        NEXT_PUBLIC_SUPABASE_URL: 'https://your-project-url.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your-anon-key',
        SUPABASE_SERVICE_ROLE_KEY: 'your-service-role-key',
      };

      const result = validateEnv(testEnv);
      expect(result).toBeDefined();
      expect(mockConsole.log).toHaveBeenCalledWith(
        '✅ Environment variables validated successfully (development)'
      );
    });
  });

  describe('validateEnv production security warnings', () => {
    it('should warn about short service role key in production', () => {
      const testEnv = {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_URL: 'https://valid-project.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          'valid-anon-key-with-sufficient-length-for-validation-requirements-to-pass-all-checks-properly-and-completely',
        SUPABASE_SERVICE_ROLE_KEY:
          'valid-but-shorter-than-200-chars-service-role-key-with-sufficient-length-for-validation-requirements',
      };

      const result = validateEnv(testEnv);
      expect(result).toBeDefined();
      expect(mockConsole.warn).toHaveBeenCalledWith(
        '⚠️  SERVICE_ROLE_KEY appears to be short. Consider rotating it for security.'
      );
    });

    it('should warn about non-supabase domain in production', () => {
      const testEnv = {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_URL: 'https://custom-domain.example.com',
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          'valid-anon-key-with-sufficient-length-for-validation-requirements-to-pass-all-checks-properly-and-completely',
        SUPABASE_SERVICE_ROLE_KEY:
          'valid-service-role-key-with-sufficient-length-for-validation-requirements-to-pass-all-security-checks-properly-and-completely-with-extra-length-for-safety',
      };

      const result = validateEnv(testEnv);
      expect(result).toBeDefined();
      expect(mockConsole.warn).toHaveBeenCalledWith(
        '⚠️  Supabase URL domain may need to be added to CSP headers'
      );
    });

    it('should not warn for valid supabase.co domains', () => {
      const testEnv = {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_URL: 'https://valid-project.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          'valid-anon-key-with-sufficient-length-for-validation-requirements-to-pass-all-checks-properly-and-completely',
        SUPABASE_SERVICE_ROLE_KEY:
          'valid-service-role-key-with-sufficient-length-for-validation-requirements-to-pass-all-security-checks-properly-and-completely-with-extra-length-for-safety-and-security',
      };

      const result = validateEnv(testEnv);
      expect(result).toBeDefined();
      expect(mockConsole.warn).not.toHaveBeenCalledWith(
        '⚠️  Supabase URL domain may need to be added to CSP headers'
      );
    });

    it('should not warn for valid supabase.in domains', () => {
      const testEnv = {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_URL: 'https://valid-project.supabase.in',
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          'valid-anon-key-with-sufficient-length-for-validation-requirements-to-pass-all-checks-properly-and-completely',
        SUPABASE_SERVICE_ROLE_KEY:
          'valid-service-role-key-with-sufficient-length-for-validation-requirements-to-pass-all-security-checks-properly-and-completely-with-extra-length-for-safety-and-security',
      };

      const result = validateEnv(testEnv);
      expect(result).toBeDefined();
      expect(mockConsole.warn).not.toHaveBeenCalledWith(
        '⚠️  Supabase URL domain may need to be added to CSP headers'
      );
    });
  });

  describe('validateEnv schema validation errors', () => {
    it('should handle Zod validation errors gracefully', () => {
      const testEnv = {
        NODE_ENV: 'invalid_environment' as any, // Invalid enum value
      };

      expect(() => validateEnv(testEnv)).toThrow();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '❌ Environment variable validation failed:'
      );
    });

    it('should handle non-Zod errors gracefully', () => {
      // Mock console.error to throw an error to simulate unexpected error
      const originalError = console.error;
      console.error = vi.fn(() => {
        throw new Error('Unexpected error');
      });

      const testEnv = {
        NODE_ENV: 'development',
      };

      try {
        expect(() => validateEnv(testEnv)).toThrow();
      } finally {
        console.error = originalError;
      }
    });
  });

  describe('validateEnv default values', () => {
    it('should apply default NODE_ENV when not provided', () => {
      const testEnv = {};

      const result = validateEnv(testEnv);
      expect(result.NODE_ENV).toBe('development');
    });

    it('should handle optional environment variables', () => {
      const testEnv = {
        NODE_ENV: 'development',
        NEXT_PUBLIC_APP_URL: 'https://example.com',
        DEBUG: 'true',
        ANALYZE: 'true',
      };

      const result = validateEnv(testEnv);
      expect(result.NEXT_PUBLIC_APP_URL).toBe('https://example.com');
      expect(result.DEBUG).toBe('true');
      expect(result.ANALYZE).toBe('true');
    });
  });

  describe('validateEnv edge cases', () => {
    it('should handle empty environment object', () => {
      const testEnv = {};

      const result = validateEnv(testEnv);
      expect(result).toBeDefined();
      expect(result.NODE_ENV).toBe('development');
    });

    it('should handle fallback with empty string primary value', () => {
      const testEnv = {
        NODE_ENV: 'development',
        NEXT_PUBLIC_SUPABASE_URL: '',
        BNSL_NEXT_PUBLIC_SUPABASE_URL: 'https://fallback.supabase.co',
      };

      const result = validateEnv(testEnv);
      expect(result.NEXT_PUBLIC_SUPABASE_URL).toBe(
        'https://fallback.supabase.co'
      );
      expect(mockConsole.warn).toHaveBeenCalledWith(
        '🔄 Using Supabase URL fallback: BNSL_NEXT_PUBLIC_SUPABASE_URL → NEXT_PUBLIC_SUPABASE_URL'
      );
    });

    it('should not apply fallback when primary value is present but falsy (except empty string)', () => {
      const testEnv = {
        NODE_ENV: 'development',
        NEXT_PUBLIC_SUPABASE_URL: '0', // Truthy string
        BNSL_NEXT_PUBLIC_SUPABASE_URL: 'https://fallback.supabase.co',
      };

      const result = validateEnv(testEnv);
      expect(result.NEXT_PUBLIC_SUPABASE_URL).toBe('0');
      expect(mockConsole.warn).not.toHaveBeenCalledWith(
        expect.stringContaining('fallback')
      );
    });
  });
});
