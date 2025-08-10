import { NextResponse } from 'next/server';

/**
 * Health check endpoint for deployment monitoring
 * Used by Infuze.cloud and other monitoring services
 */
export async function GET() {
  try {
    const startTime = Date.now();

    // Basic health checks
    const health: any = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',

      // System information
      system: {
        nodejs: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: {
          used: process.memoryUsage().heapUsed,
          total: process.memoryUsage().heapTotal,
          external: process.memoryUsage().external,
          rss: process.memoryUsage().rss,
        },
      },

      // Application-specific checks
      application: {
        name: 'The Best Nexus Letters',
        features: {
          supabase:
            !!process.env.SUPABASE_URL &&
            process.env.SUPABASE_URL !== 'your-project-url.supabase.co',
          discourse: !!process.env.DISCOURSE_SECRET,
          theming: true,
          api: true,
        },
      },
    };

    // Perform additional health checks
    const checks = await performHealthChecks();
    health.checks = checks;

    // Calculate response time
    const responseTime = Date.now() - startTime;
    health.responseTime = responseTime;

    // Determine overall health status
    const hasFailedChecks = checks.some(check => check.status !== 'pass');
    if (hasFailedChecks) {
      health.status = 'degraded';
      return NextResponse.json(health, { status: 503 });
    }

    return NextResponse.json(health, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  }
}

/**
 * Perform various health checks
 */
async function performHealthChecks() {
  const checks = [];

  // Database connectivity check
  checks.push(await checkDatabase());

  // External services check
  checks.push(await checkExternalServices());

  // File system check
  checks.push(await checkFileSystem());

  // Memory usage check
  checks.push(checkMemoryUsage());

  return checks;
}

/**
 * Check database connectivity
 */
async function checkDatabase() {
  const check = {
    name: 'database',
    status: 'pass',
    details: {},
    timestamp: new Date().toISOString(),
  };

  try {
    // Skip if Supabase is not configured
    if (
      !process.env.SUPABASE_URL ||
      process.env.SUPABASE_URL === 'your-project-url.supabase.co'
    ) {
      check.status = 'skip';
      check.details = { reason: 'Database not configured' };
      return check;
    }

    // In a real implementation, you would test the database connection here
    // For now, we'll just check if environment variables are set
    const hasUrl = !!process.env.SUPABASE_URL;
    const hasKey = !!process.env.SUPABASE_ANON_KEY;

    if (!hasUrl || !hasKey) {
      check.status = 'fail';
      check.details = {
        reason: 'Missing database configuration',
        hasUrl,
        hasKey,
      };
    } else {
      check.details = { message: 'Database configuration present' };
    }
  } catch (error) {
    check.status = 'fail';
    check.details = {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  return check;
}

/**
 * Check external services
 */
async function checkExternalServices() {
  const check = {
    name: 'external_services',
    status: 'pass',
    details: {},
    timestamp: new Date().toISOString(),
  };

  try {
    // Check if required external service configurations are present
    const services = {
      discourse: !!process.env.DISCOURSE_SECRET,
      // Add other external services here
    };

    check.details = { services };

    // For now, we'll consider this a pass if we can check the configurations
    // In production, you might want to actually ping the services
  } catch (error) {
    check.status = 'fail';
    check.details = {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  return check;
}

/**
 * Check file system access
 */
async function checkFileSystem() {
  const check = {
    name: 'filesystem',
    status: 'pass',
    details: {},
    timestamp: new Date().toISOString(),
  };

  try {
    // Simple file system check - verify we can access the current directory
    const fs = await import('fs/promises');
    await fs.access(process.cwd());

    check.details = { message: 'File system accessible' };
  } catch (error) {
    check.status = 'fail';
    check.details = {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  return check;
}

/**
 * Check memory usage
 */
function checkMemoryUsage() {
  const check = {
    name: 'memory',
    status: 'pass',
    details: {} as any,
    timestamp: new Date().toISOString(),
  };

  try {
    const memUsage = process.memoryUsage();
    const totalMemory = memUsage.heapTotal;
    const usedMemory = memUsage.heapUsed;
    const memoryUsagePercent = (usedMemory / totalMemory) * 100;

    check.details = {
      usedBytes: usedMemory,
      totalBytes: totalMemory,
      usagePercent: Math.round(memoryUsagePercent * 100) / 100,
    };

    // Consider memory usage critical if over 90%
    if (memoryUsagePercent > 90) {
      check.status = 'fail';
      check.details.warning = 'High memory usage';
    } else if (memoryUsagePercent > 80) {
      check.status = 'warn';
      check.details.warning = 'Elevated memory usage';
    }
  } catch (error) {
    check.status = 'fail';
    check.details = {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  return check;
}
