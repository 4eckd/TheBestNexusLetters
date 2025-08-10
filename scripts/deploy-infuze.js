#!/usr/bin/env node

/**
 * Infuze.cloud deployment script for The Best Nexus Letters
 * Automates deployment process with pre-checks and monitoring
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

class InfuzeDeployer {
  constructor() {
    this.projectRoot = process.cwd();
    this.configPath = path.join(this.projectRoot, 'infuze.config.js');
    this.environment = process.argv.includes('--staging')
      ? 'staging'
      : 'production';
    this.dryRun = process.argv.includes('--dry-run');
    this.skipChecks = process.argv.includes('--skip-checks');
    this.verbose =
      process.argv.includes('--verbose') || process.argv.includes('-v');
    this.force = process.argv.includes('--force');
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logVerbose(message, color = 'cyan') {
    if (this.verbose) {
      this.log(`  ${message}`, color);
    }
  }

  async executeCommand(command, options = {}) {
    this.logVerbose(`Executing: ${command}`);

    try {
      const result = execSync(command, {
        encoding: 'utf8',
        stdio: this.verbose ? 'inherit' : 'pipe',
        cwd: this.projectRoot,
        ...options,
      });
      return { success: true, output: result };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.status,
        output: error.stdout || error.stderr || '',
      };
    }
  }

  async checkPrerequisites() {
    this.log('\n🔍 Checking prerequisites...', 'blue');

    const checks = [
      {
        name: 'Node.js version',
        command: 'node --version',
        validate: output => {
          const version = output.trim();
          const major = parseInt(version.replace('v', '').split('.')[0]);
          return major >= 18;
        },
      },
      {
        name: 'pnpm installation',
        command: 'pnpm --version',
        validate: () => true,
      },
      {
        name: 'Infuze CLI',
        command: 'infuze --version',
        validate: () => true,
        install: 'pnpm install -g infuze',
      },
      {
        name: 'Git status',
        command: 'git status --porcelain',
        validate: output => {
          if (!this.force && output.trim() !== '') {
            this.log(
              '⚠️  Working directory has uncommitted changes. Use --force to proceed.',
              'yellow'
            );
            return false;
          }
          return true;
        },
      },
      {
        name: 'Infuze config',
        command: `node -e "console.log('Config exists')"`,
        validate: () => fs.existsSync(this.configPath),
      },
    ];

    for (const check of checks) {
      this.logVerbose(`Checking ${check.name}...`);
      const result = await this.executeCommand(check.command);

      if (!result.success) {
        if (check.install) {
          this.log(`Installing ${check.name}...`, 'yellow');
          const installResult = await this.executeCommand(check.install);
          if (!installResult.success) {
            this.log(`❌ Failed to install ${check.name}`, 'red');
            return false;
          }
          continue;
        }

        this.log(`❌ ${check.name} check failed: ${result.error}`, 'red');
        return false;
      }

      if (check.validate && !check.validate(result.output)) {
        this.log(`❌ ${check.name} validation failed`, 'red');
        return false;
      }

      this.log(`✅ ${check.name}`, 'green');
    }

    return true;
  }

  async runPreDeploymentChecks() {
    if (this.skipChecks) {
      this.log('\n⏭️  Skipping pre-deployment checks...', 'yellow');
      return true;
    }

    this.log('\n🧪 Running pre-deployment checks...', 'blue');

    const checks = [
      {
        name: 'TypeScript type checking',
        command: 'pnpm run type-check',
        timeout: 300000, // 5 minutes
      },
      {
        name: 'ESLint',
        command: 'pnpm run lint',
        timeout: 120000, // 2 minutes
      },
      {
        name: 'Unit tests',
        command: 'pnpm run test:run',
        timeout: 300000, // 5 minutes
      },
      {
        name: 'Build verification',
        command: 'pnpm run build',
        timeout: 600000, // 10 minutes
      },
    ];

    for (const check of checks) {
      this.logVerbose(`Running ${check.name}...`);
      const startTime = Date.now();

      const result = await this.executeCommand(check.command, {
        timeout: check.timeout,
      });

      const duration = Date.now() - startTime;

      if (!result.success) {
        this.log(
          `❌ ${check.name} failed (${Math.round(duration / 1000)}s)`,
          'red'
        );
        if (result.output) {
          this.log(result.output, 'red');
        }
        return false;
      }

      this.log(`✅ ${check.name} (${Math.round(duration / 1000)}s)`, 'green');
    }

    return true;
  }

  async deployToInfuze() {
    this.log(`\n🚀 Deploying to Infuze.cloud (${this.environment})...`, 'blue');

    if (this.dryRun) {
      this.log(
        'Running in DRY RUN mode - no actual deployment will occur',
        'yellow'
      );
      this.log('Deployment command would be:', 'cyan');
      this.log(
        `  infuze deploy --env ${this.environment} --config ${this.configPath}`,
        'dim'
      );
      return true;
    }

    // Clean build artifacts first
    this.log('Cleaning build artifacts...', 'cyan');
    await this.executeCommand('node scripts/clean.js');

    // Install dependencies with frozen lockfile
    this.log('Installing dependencies...', 'cyan');
    const installResult = await this.executeCommand(
      'pnpm install --frozen-lockfile'
    );
    if (!installResult.success) {
      this.log('❌ Failed to install dependencies', 'red');
      return false;
    }

    // Build the application
    this.log('Building application...', 'cyan');
    const buildResult = await this.executeCommand('pnpm run build');
    if (!buildResult.success) {
      this.log('❌ Build failed', 'red');
      return false;
    }

    // Deploy to Infuze
    const deployCommand = `infuze deploy --env ${this.environment} --config ${this.configPath}`;
    this.log('Executing deployment...', 'cyan');

    const deployResult = await this.executeCommand(deployCommand, {
      stdio: 'inherit', // Show live output
    });

    if (!deployResult.success) {
      this.log('❌ Deployment failed', 'red');
      return false;
    }

    this.log('✅ Deployment completed successfully!', 'green');
    return true;
  }

  async runPostDeploymentChecks() {
    this.log('\n🔍 Running post-deployment checks...', 'blue');

    // Load configuration to get the deployment URL
    const config = require(this.configPath);
    const envConfig = config.environments[this.environment] || config;
    const baseUrl =
      this.environment === 'staging'
        ? 'https://staging.thebestnexusletters.com'
        : 'https://thebestnexusletters.com';

    const checks = [
      {
        name: 'Health check',
        command: `curl -f -s ${baseUrl}/api/health || echo "Health check failed"`,
        retries: 3,
        delay: 5000, // 5 seconds
      },
      {
        name: 'Homepage accessibility',
        command: `curl -f -s -o /dev/null ${baseUrl} && echo "Homepage accessible"`,
        retries: 2,
        delay: 3000,
      },
      {
        name: 'Response time check',
        command: `curl -w "Response time: %{time_total}s\\n" -o /dev/null -s ${baseUrl}`,
      },
    ];

    let allChecksPassed = true;

    for (const check of checks) {
      this.logVerbose(`Running ${check.name}...`);
      let success = false;

      for (let attempt = 1; attempt <= (check.retries || 1); attempt++) {
        if (attempt > 1) {
          this.logVerbose(
            `Retry ${attempt}/${check.retries} for ${check.name}...`
          );
          await new Promise(resolve => setTimeout(resolve, check.delay));
        }

        const result = await this.executeCommand(check.command);

        if (result.success) {
          success = true;
          if (result.output) {
            this.logVerbose(result.output.trim());
          }
          break;
        }
      }

      if (success) {
        this.log(`✅ ${check.name}`, 'green');
      } else {
        this.log(`❌ ${check.name} failed`, 'red');
        allChecksPassed = false;
      }
    }

    return allChecksPassed;
  }

  async generateDeploymentSummary() {
    this.log('\n📊 Deployment Summary', 'blue');

    const config = require(this.configPath);
    const timestamp = new Date().toISOString();

    // Get current git information
    const gitInfo = {
      branch: '',
      commit: '',
      author: '',
    };

    try {
      gitInfo.branch = execSync('git rev-parse --abbrev-ref HEAD', {
        encoding: 'utf8',
      }).trim();
      gitInfo.commit = execSync('git rev-parse --short HEAD', {
        encoding: 'utf8',
      }).trim();
      gitInfo.author = execSync('git log -1 --format="%an"', {
        encoding: 'utf8',
      }).trim();
    } catch (error) {
      // Git info not available
    }

    const summary = {
      deployment: {
        timestamp,
        environment: this.environment,
        version: config.version,
        status: 'completed',
      },
      git: gitInfo,
      config: {
        instance: config.instance?.type || 'unknown',
        memory: config.instance?.memory || 'unknown',
        region: config.instance?.region || 'unknown',
      },
      urls: {
        production: 'https://thebestnexusletters.com',
        staging: 'https://staging.thebestnexusletters.com',
      },
    };

    this.log(`Environment: ${summary.deployment.environment}`, 'cyan');
    this.log(`Version: ${summary.deployment.version}`, 'cyan');
    this.log(
      `Instance: ${summary.config.instance} (${summary.config.memory}, ${summary.config.region})`,
      'cyan'
    );

    if (gitInfo.branch) {
      this.log(
        `Git: ${gitInfo.branch}@${gitInfo.commit} by ${gitInfo.author}`,
        'cyan'
      );
    }

    this.log(`URL: ${summary.urls[this.environment]}`, 'cyan');
    this.log(`Time: ${timestamp}`, 'cyan');

    // Save deployment info
    const deploymentInfo = {
      ...summary,
      fullConfig: config,
    };

    const infoPath = path.join(
      this.projectRoot,
      '.infuze',
      'last-deployment.json'
    );
    fs.mkdirSync(path.dirname(infoPath), { recursive: true });
    fs.writeFileSync(infoPath, JSON.stringify(deploymentInfo, null, 2));

    this.log(`\n✅ Deployment information saved to ${infoPath}`, 'green');
  }

  showHelp() {
    this.log(
      `
${colors.bright}🚀 Infuze.cloud Deployment Script${colors.reset}

${colors.bright}Usage:${colors.reset}
  node scripts/deploy-infuze.js [options]

${colors.bright}Options:${colors.reset}
  --staging         Deploy to staging environment
  --dry-run         Show what would be deployed without actually deploying
  --skip-checks     Skip pre-deployment checks (not recommended)
  --force           Force deployment even with uncommitted changes
  --verbose, -v     Show detailed output
  --help, -h        Show this help message

${colors.bright}Examples:${colors.reset}
  node scripts/deploy-infuze.js                    # Deploy to production
  node scripts/deploy-infuze.js --staging          # Deploy to staging
  node scripts/deploy-infuze.js --dry-run          # Preview deployment
  node scripts/deploy-infuze.js --verbose          # Detailed output
  node scripts/deploy-infuze.js --staging --force  # Force staging deployment

${colors.bright}Prerequisites:${colors.reset}
  • Node.js 18+
  • pnpm package manager
  • Infuze CLI (automatically installed if missing)
  • Clean git working directory (or use --force)
  • infuze.config.js configuration file

${colors.bright}Deployment Process:${colors.reset}
  1. Check prerequisites
  2. Run pre-deployment checks (type-check, lint, test, build)
  3. Clean build artifacts
  4. Install dependencies
  5. Build application
  6. Deploy to Infuze.cloud
  7. Run post-deployment health checks
  8. Generate deployment summary

`,
      'cyan'
    );
  }

  async run() {
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
      this.showHelp();
      return;
    }

    this.log(
      `${colors.bright}🚀 Infuze.cloud Deployment Tool${colors.reset}`,
      'blue'
    );
    this.log(`Environment: ${this.environment}`, 'cyan');

    if (this.dryRun) {
      this.log('Mode: DRY RUN', 'yellow');
    }

    try {
      // Step 1: Check prerequisites
      const prereqsPassed = await this.checkPrerequisites();
      if (!prereqsPassed) {
        this.log(
          '\n❌ Prerequisites check failed. Please fix the issues above.',
          'red'
        );
        process.exit(1);
      }

      // Step 2: Run pre-deployment checks
      const checksPassed = await this.runPreDeploymentChecks();
      if (!checksPassed) {
        this.log(
          '\n❌ Pre-deployment checks failed. Please fix the issues above.',
          'red'
        );
        process.exit(1);
      }

      // Step 3: Deploy to Infuze
      const deploymentSuccessful = await this.deployToInfuze();
      if (!deploymentSuccessful) {
        this.log('\n❌ Deployment failed.', 'red');
        process.exit(1);
      }

      // Step 4: Post-deployment checks (only for actual deployments)
      if (!this.dryRun) {
        const postChecksPassed = await this.runPostDeploymentChecks();
        if (!postChecksPassed) {
          this.log(
            '\n⚠️  Some post-deployment checks failed, but deployment was successful.',
            'yellow'
          );
        }

        // Step 5: Generate summary
        await this.generateDeploymentSummary();
      }

      this.log(
        `\n🎉 ${this.dryRun ? 'Dry run' : 'Deployment'} completed successfully!`,
        'green'
      );

      if (!this.dryRun) {
        const url =
          this.environment === 'staging'
            ? 'https://staging.thebestnexusletters.com'
            : 'https://thebestnexusletters.com';
        this.log(`🌐 Your application is live at: ${url}`, 'cyan');
      }
    } catch (error) {
      this.log(`\n💥 Fatal error: ${error.message}`, 'red');
      if (this.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
}

// Run the deployer
if (require.main === module) {
  const deployer = new InfuzeDeployer();
  deployer.run().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { InfuzeDeployer };
