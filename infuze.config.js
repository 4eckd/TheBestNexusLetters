/**
 * Infuze.cloud deployment configuration for The Best Nexus Letters
 * High-performance, cost-effective cloud hosting
 */

module.exports = {
  // Project identification
  name: 'the-best-nexus-letters',
  displayName: 'The Best Nexus Letters',
  version: '1.0.0',

  // Infuze.cloud instance configuration
  instance: {
    // Core instance specifications - optimized for Next.js apps
    type: 'core-2', // 2 vCPU cores, dedicated performance
    memory: '4GB', // Dedicated RAM
    storage: '40GB', // NVMe SSD storage
    bandwidth: '2TB', // Monthly bandwidth allowance

    // Geographic region (London datacenter)
    region: 'london-1',

    // High availability configuration
    availability: {
      multiZone: false, // Start with single zone, can scale later
      autoBackup: true,
      backupRetention: 7, // days
    },
  },

  // Application build configuration
  build: {
    // Build commands
    commands: {
      install: 'pnpm install --frozen-lockfile',
      build: 'pnpm run build',
      start: 'pnpm run start',
    },

    // Environment configuration
    node: {
      version: '18.x',
      packageManager: 'pnpm',
    },

    // Build optimization
    optimization: {
      caching: true,
      compression: true,
      minification: true,
      treeshaking: true,
    },

    // Build artifacts
    outputDirectory: '.next',
    staticDirectory: 'public',
  },

  // Runtime configuration
  runtime: {
    // Port configuration
    port: 3000,
    host: '0.0.0.0',

    // Process management
    processes: 2, // PM2 cluster mode for high availability
    maxMemory: '3GB', // Leave 1GB for system overhead

    // Health checks
    healthCheck: {
      path: '/api/health',
      interval: 30, // seconds
      timeout: 5, // seconds
      retries: 3,
    },

    // Auto-scaling (if available in plan)
    scaling: {
      minInstances: 1,
      maxInstances: 3,
      cpuThreshold: 80, // percentage
      memoryThreshold: 85, // percentage
    },
  },

  // Network and security configuration
  network: {
    // Custom domain configuration
    domains: [
      {
        name: 'thebestnexusletters.com',
        ssl: true,
        redirect: {
          www: true, // Redirect www to non-www
          https: true, // Force HTTPS
        },
      },
      {
        name: 'www.thebestnexusletters.com',
        redirectTo: 'thebestnexusletters.com',
      },
    ],

    // CDN configuration
    cdn: {
      enabled: true,
      caching: {
        static: '365d', // Cache static assets for 1 year
        html: '1h', // Cache HTML for 1 hour
        api: 'no-cache', // No caching for API responses
      },
      gzip: true,
      brotli: true,
    },

    // Security headers
    security: {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      },

      // Rate limiting
      rateLimit: {
        enabled: true,
        rpm: 1000, // requests per minute per IP
        burst: 100, // burst capacity
      },

      // DDoS protection
      ddos: {
        enabled: true,
        threshold: 1000, // requests per minute
      },
    },
  },

  // Environment variables
  environment: {
    NODE_ENV: 'production',

    // Next.js configuration
    NEXT_TELEMETRY_DISABLED: '1',

    // Application URLs
    NEXT_PUBLIC_APP_URL: 'https://thebestnexusletters.com',
    NEXT_PUBLIC_API_URL: 'https://thebestnexusletters.com/api',

    // Feature flags
    NEXT_PUBLIC_MAINTENANCE_MODE: 'false',

    // Secrets (configured separately in deployment)
    secrets: [
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXTAUTH_SECRET',
      'DISCOURSE_SECRET',
      'DISCOURSE_SSO_SECRET',
      'DATABASE_URL',
    ],
  },

  // Monitoring and logging
  monitoring: {
    // Application monitoring
    metrics: {
      enabled: true,
      retention: '30d',
    },

    // Log configuration
    logging: {
      level: 'info',
      retention: '7d',
      format: 'json',

      // Log shipping (optional)
      shipping: {
        enabled: false, // Can enable later for centralized logging
      },
    },

    // Alerts
    alerts: {
      enabled: true,
      channels: ['email'], // Add Discord/Slack later if needed
      conditions: [
        {
          metric: 'cpu_usage',
          threshold: 90,
          duration: '5m',
        },
        {
          metric: 'memory_usage',
          threshold: 95,
          duration: '2m',
        },
        {
          metric: 'response_time',
          threshold: 5000, // 5 seconds
          duration: '1m',
        },
        {
          metric: 'error_rate',
          threshold: 5, // 5% error rate
          duration: '1m',
        },
      ],
    },
  },

  // Database configuration (if using Infuze managed databases)
  database: {
    type: 'postgresql',
    version: '15',

    // Connection pooling
    pooling: {
      enabled: true,
      minConnections: 2,
      maxConnections: 20,
    },

    // Backup configuration
    backup: {
      enabled: true,
      schedule: '0 2 * * *', // Daily at 2 AM
      retention: '7d',
    },

    // Performance tuning
    performance: {
      sharedBuffers: '256MB',
      effectiveCacheSize: '1GB',
      workMem: '64MB',
    },
  },

  // Deployment pipeline
  deployment: {
    // Git integration
    git: {
      provider: 'github',
      repository: 'theprimeagen/TheBestNexusLetters',
      branch: 'main',

      // Auto-deployment
      autoDeploy: {
        enabled: true,
        branches: ['main'],
        skipCI: false,
      },
    },

    // Deployment strategy
    strategy: 'rolling', // Zero-downtime deployments

    // Pre-deployment checks
    checks: [
      {
        name: 'build',
        command: 'pnpm run build',
        timeout: 600, // 10 minutes
      },
      {
        name: 'type-check',
        command: 'pnpm run type-check',
        timeout: 300, // 5 minutes
      },
      {
        name: 'lint',
        command: 'pnpm run lint',
        timeout: 120, // 2 minutes
      },
      {
        name: 'test',
        command: 'pnpm run test:run',
        timeout: 300, // 5 minutes
      },
    ],

    // Post-deployment actions
    postDeploy: [
      {
        name: 'cache-warm',
        command: 'curl -s https://thebestnexusletters.com > /dev/null',
      },
      {
        name: 'health-check',
        command: 'curl -f https://thebestnexusletters.com/api/health',
        retries: 3,
        delay: 5, // seconds between retries
      },
    ],
  },

  // Cost optimization
  optimization: {
    // Resource scheduling (scale down during low traffic)
    scheduling: {
      enabled: true,
      timezone: 'UTC',

      // Scale down during low traffic hours (2 AM - 6 AM UTC)
      schedules: [
        {
          cron: '0 2 * * *',
          action: 'scale',
          instances: 1,
        },
        {
          cron: '0 6 * * *',
          action: 'scale',
          instances: 2,
        },
      ],
    },

    // Storage optimization
    storage: {
      compression: true,
      cleanup: {
        enabled: true,
        oldBuilds: 3, // Keep last 3 builds
        logs: '7d', // Keep logs for 7 days
        temp: '1d', // Clean temp files after 1 day
      },
    },
  },

  // Development and staging environments
  environments: {
    staging: {
      instance: {
        type: 'core-1', // Smaller instance for staging
        memory: '2GB',
        storage: '20GB',
      },

      domains: [
        {
          name: 'staging.thebestnexusletters.com',
          ssl: true,
        },
      ],

      git: {
        branch: 'develop',
        autoDeploy: {
          enabled: true,
          branches: ['develop', 'staging'],
        },
      },

      environment: {
        NODE_ENV: 'staging',
        NEXT_PUBLIC_APP_URL: 'https://staging.thebestnexusletters.com',
      },
    },

    preview: {
      // Preview deployments for pull requests
      enabled: true,

      instance: {
        type: 'micro', // Smallest instance for previews
        memory: '1GB',
        storage: '10GB',

        // Auto-cleanup after 7 days
        ttl: '7d',
      },

      git: {
        pullRequests: true,
        branches: ['feature/*', 'bugfix/*'],
      },
    },
  },
};
