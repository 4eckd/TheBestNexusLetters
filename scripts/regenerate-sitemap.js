#!/usr/bin/env node

/**
 * Regenerate Sitemap Script
 * 
 * This script triggers a rebuild of the sitemap for The Best Nexus Letters
 * application. It's designed to be run as a weekly cron job to ensure the
 * sitemap stays fresh and reflects any dynamic content changes.
 * 
 * Usage:
 * - Direct: node scripts/regenerate-sitemap.js
 * - Cron: 0 2 * * 0 cd /path/to/project && node scripts/regenerate-sitemap.js
 * 
 * Environment Variables Required:
 * - VERCEL_TOKEN: Vercel API token for deployment triggers
 * - VERCEL_PROJECT_ID: Vercel project ID
 * - VERCEL_ORG_ID: Vercel organization ID
 */

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  vercelApiUrl: 'https://api.vercel.com/v1',
  logFile: path.join(__dirname, '..', 'logs', 'sitemap-regeneration.log'),
  maxLogSize: 10 * 1024 * 1024, // 10MB
  maxLogFiles: 5
};

/**
 * Logger utility for structured logging
 */
class Logger {
  constructor(logFile) {
    this.logFile = logFile;
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(data && { data })
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    
    // Console output
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
    if (data) {
      console.log('Data:', JSON.stringify(data, null, 2));
    }

    // File output
    try {
      fs.appendFileSync(this.logFile, logLine);
      this.rotateLogIfNeeded();
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  rotateLogIfNeeded() {
    try {
      const stats = fs.statSync(this.logFile);
      if (stats.size > config.maxLogSize) {
        for (let i = config.maxLogFiles - 1; i >= 1; i--) {
          const oldFile = `${this.logFile}.${i}`;
          const newFile = `${this.logFile}.${i + 1}`;
          
          if (fs.existsSync(oldFile)) {
            if (i === config.maxLogFiles - 1) {
              fs.unlinkSync(oldFile);
            } else {
              fs.renameSync(oldFile, newFile);
            }
          }
        }
        
        fs.renameSync(this.logFile, `${this.logFile}.1`);
      }
    } catch (error) {
      console.error('Log rotation failed:', error);
    }
  }

  info(message, data) { this.log('info', message, data); }
  warn(message, data) { this.log('warn', message, data); }
  error(message, data) { this.log('error', message, data); }
}

/**
 * Sitemap regeneration utilities
 */
class SitemapRegenerator {
  constructor(logger) {
    this.logger = logger;
    this.vercelToken = process.env.VERCEL_TOKEN;
    this.projectId = process.env.VERCEL_PROJECT_ID;
    this.orgId = process.env.VERCEL_ORG_ID;
  }

  validateEnvironment() {
    const required = ['VERCEL_TOKEN', 'VERCEL_PROJECT_ID', 'VERCEL_ORG_ID'];
    const missing = required.filter(env => !process.env[env]);

    if (missing.length > 0) {
      this.logger.error('Missing required environment variables', { missing });
      return false;
    }

    return true;
  }

  async makeVercelRequest(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.vercel.com',
        path,
        method,
        headers: {
          'Authorization': `Bearer ${this.vercelToken}`,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error(`Vercel API error: ${res.statusCode} - ${parsed.error?.message || data}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        });
      });

      req.on('error', reject);
      
      if (body) {
        req.write(JSON.stringify(body));
      }
      
      req.end();
    });
  }

  async triggerDeployment() {
    this.logger.info('Triggering Vercel deployment to regenerate sitemap');

    try {
      const deployment = await this.makeVercelRequest(
        `/v13/deployments?teamId=${this.orgId}`,
        'POST',
        {
          name: 'thebestnexusletters',
          project: this.projectId,
          target: 'production',
          gitSource: {
            type: 'github',
            repoId: this.projectId
          },
          build: {
            env: {
              NEXT_PUBLIC_SITEMAP_REGENERATED: new Date().toISOString()
            }
          }
        }
      );

      this.logger.info('Deployment triggered successfully', {
        deploymentId: deployment.id,
        url: deployment.url,
        state: deployment.readyState
      });

      return deployment;
    } catch (error) {
      this.logger.error('Failed to trigger deployment', { error: error.message });
      throw error;
    }
  }

  async waitForDeployment(deploymentId, maxWaitTime = 600000) { // 10 minutes
    this.logger.info('Waiting for deployment to complete', { deploymentId });

    const startTime = Date.now();
    const checkInterval = 30000; // 30 seconds

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const deployment = await this.makeVercelRequest(
          `/v13/deployments/${deploymentId}?teamId=${this.orgId}`
        );

        this.logger.info('Deployment status check', {
          deploymentId,
          state: deployment.readyState,
          url: deployment.url
        });

        if (deployment.readyState === 'READY') {
          this.logger.info('Deployment completed successfully', {
            deploymentId,
            url: deployment.url,
            duration: Date.now() - startTime
          });
          return deployment;
        }

        if (deployment.readyState === 'ERROR') {
          throw new Error('Deployment failed');
        }

        // Wait before next check
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      } catch (error) {
        this.logger.error('Error checking deployment status', {
          deploymentId,
          error: error.message
        });
        throw error;
      }
    }

    throw new Error('Deployment timeout exceeded');
  }

  async validateSitemap(baseUrl) {
    this.logger.info('Validating sitemap accessibility', { baseUrl });

    return new Promise((resolve, reject) => {
      const sitemapUrl = `${baseUrl}/sitemap.xml`;
      
      https.get(sitemapUrl, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            const isValidXML = data.includes('<?xml') && data.includes('<urlset');
            
            if (isValidXML) {
              const urlCount = (data.match(/<url>/g) || []).length;
              this.logger.info('Sitemap validation successful', {
                sitemapUrl,
                urlCount,
                size: data.length
              });
              resolve({ valid: true, urlCount, size: data.length });
            } else {
              this.logger.warn('Sitemap format appears invalid', { sitemapUrl });
              resolve({ valid: false, reason: 'Invalid XML format' });
            }
          } else {
            this.logger.warn('Sitemap not accessible', {
              sitemapUrl,
              statusCode: res.statusCode
            });
            resolve({ valid: false, reason: `HTTP ${res.statusCode}` });
          }
        });
      }).on('error', (error) => {
        this.logger.error('Failed to validate sitemap', {
          sitemapUrl,
          error: error.message
        });
        reject(error);
      });
    });
  }

  async regenerate() {
    this.logger.info('Starting sitemap regeneration process');

    try {
      // Validate environment
      if (!this.validateEnvironment()) {
        throw new Error('Environment validation failed');
      }

      // Trigger deployment
      const deployment = await this.triggerDeployment();
      
      // Wait for completion
      await this.waitForDeployment(deployment.id);
      
      // Validate the new sitemap
      const validation = await this.validateSitemap(deployment.url);
      
      if (!validation.valid) {
        this.logger.warn('Sitemap validation failed after regeneration', validation);
      }

      this.logger.info('Sitemap regeneration completed successfully', {
        deploymentUrl: deployment.url,
        sitemapValidation: validation
      });

      return {
        success: true,
        deploymentUrl: deployment.url,
        validation
      };

    } catch (error) {
      this.logger.error('Sitemap regeneration failed', {
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  const logger = new Logger(config.logFile);
  const regenerator = new SitemapRegenerator(logger);

  logger.info('Sitemap regeneration job started');

  try {
    const result = await regenerator.regenerate();
    logger.info('Job completed successfully', result);
    process.exit(0);
  } catch (error) {
    logger.error('Job failed', { error: error.message });
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SitemapRegenerator, Logger };
