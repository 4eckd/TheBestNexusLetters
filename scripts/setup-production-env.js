#!/usr/bin/env node

/**
 * Production Environment Setup Script
 * Automates the creation of production environment configuration
 * Handles Supabase, secrets generation, and GitHub integration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

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

class ProductionEnvSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.configDir = path.join(this.projectRoot, '.config');
    this.templatesDir = path.join(this.configDir, 'templates');
    this.outputDir = path.join(this.configDir, 'generated');
    this.interactive = !process.argv.includes('--non-interactive');
    this.dryRun = process.argv.includes('--dry-run');
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  generateSecureSecret(length = 32) {
    return crypto.randomBytes(length).toString('base64');
  }

  generateSupabaseProjectId() {
    // Generate a realistic Supabase project ID format
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 20; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  generateSupabaseKey(type = 'anon') {
    // Generate realistic Supabase key format (JWT-like structure)
    const header = Buffer.from(
      JSON.stringify({
        alg: 'HS256',
        typ: 'JWT',
      })
    ).toString('base64url');

    const payload = Buffer.from(
      JSON.stringify({
        iss: 'supabase',
        ref: 'your-project-ref',
        role: type,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 1 year
      })
    ).toString('base64url');

    const signature = crypto.randomBytes(32).toString('base64url');

    return `${header}.${payload}.${signature}`;
  }

  async promptForInput(question, defaultValue = '', required = true) {
    if (!this.interactive) {
      return defaultValue;
    }

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise(resolve => {
      const promptText = defaultValue
        ? `${question} (${defaultValue}): `
        : `${question}: `;

      rl.question(promptText, answer => {
        rl.close();
        const result = answer.trim() || defaultValue;

        if (required && !result) {
          this.log('This field is required!', 'red');
          return this.promptForInput(question, defaultValue, required);
        }

        resolve(result);
      });
    });
  }

  async collectSupabaseConfig() {
    this.log('\n🗄️  Supabase Configuration Setup', 'blue');
    this.log('Choose an option:', 'cyan');
    this.log('1. Enter existing Supabase production credentials');
    this.log('2. Generate development/staging credentials');
    this.log('3. Use placeholder values (for later configuration)');

    const choice = await this.promptForInput('Enter choice (1-3)', '3', true);

    let config = {};

    switch (choice) {
      case '1':
        this.log('\n📝 Enter your Supabase production credentials:', 'green');
        config = {
          NEXT_PUBLIC_SUPABASE_URL: await this.promptForInput(
            'Supabase Project URL (https://xxx.supabase.co)',
            '',
            true
          ),
          NEXT_PUBLIC_SUPABASE_ANON_KEY: await this.promptForInput(
            'Supabase Anonymous Key',
            '',
            true
          ),
          SUPABASE_SERVICE_ROLE_KEY: await this.promptForInput(
            'Supabase Service Role Key',
            '',
            true
          ),
        };
        break;

      case '2':
        this.log('\n🔧 Generating development credentials...', 'yellow');
        const projectId = this.generateSupabaseProjectId();
        config = {
          NEXT_PUBLIC_SUPABASE_URL: `https://${projectId}.supabase.co`,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: this.generateSupabaseKey('anon'),
          SUPABASE_SERVICE_ROLE_KEY: this.generateSupabaseKey('service_role'),
        };
        this.log('✅ Development credentials generated', 'green');
        break;

      case '3':
      default:
        this.log('\n📋 Using placeholder values...', 'yellow');
        config = {
          NEXT_PUBLIC_SUPABASE_URL: 'https://your-project-id.supabase.co',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your-anon-key-here',
          SUPABASE_SERVICE_ROLE_KEY: 'your-service-role-key-here',
        };
        break;
    }

    return config;
  }

  async collectApplicationSecrets() {
    this.log('\n🔐 Application Secrets Generation', 'blue');

    return {
      NEXTAUTH_SECRET: this.generateSecureSecret(),
      JWT_SECRET: this.generateSecureSecret(),
      ENCRYPTION_KEY: this.generateSecureSecret(16),
    };
  }

  async collectOptionalServices() {
    this.log('\n🔌 Optional Services Configuration', 'blue');

    const useDiscourse = await this.promptForInput(
      'Enable Discourse integration? (y/n)',
      'n'
    );

    const useEmail = await this.promptForInput(
      'Enable email service? (y/n)',
      'n'
    );

    const useAnalytics = await this.promptForInput(
      'Enable Google Analytics? (y/n)',
      'n'
    );

    let config = {};

    if (useDiscourse.toLowerCase() === 'y') {
      config.DISCOURSE_SECRET = this.generateSecureSecret();
      config.DISCOURSE_SSO_SECRET = this.generateSecureSecret();
      config.DISCOURSE_BASE_URL = await this.promptForInput(
        'Discourse base URL',
        'https://community.thebestnexusletters.com'
      );
    }

    if (useEmail.toLowerCase() === 'y') {
      config.EMAIL_API_KEY = await this.promptForInput(
        'Email service API key (e.g., SendGrid, Mailgun)',
        'your-email-api-key'
      );
      config.EMAIL_FROM = await this.promptForInput(
        'From email address',
        'noreply@thebestnexusletters.com'
      );
    }

    if (useAnalytics.toLowerCase() === 'y') {
      config.NEXT_PUBLIC_GA_ID = await this.promptForInput(
        'Google Analytics ID',
        'G-XXXXXXXXXX'
      );
    }

    return config;
  }

  generateEnvFile(config, filename) {
    const envContent = `# =================================
# ${filename.toUpperCase()} ENVIRONMENT
# =================================
# Generated on: ${new Date().toISOString()}
# Generated by: Production Environment Setup Script

# =================================
# APPLICATION CONFIGURATION
# =================================
NODE_ENV=${filename === 'production' ? 'production' : 'development'}
NEXT_PUBLIC_APP_URL=${filename === 'production' ? 'https://thebestnexusletters.com' : 'https://staging.thebestnexusletters.com'}
NEXT_TELEMETRY_DISABLED=1

# =================================
# DATABASE CONFIGURATION (SUPABASE)
# =================================
${Object.entries(config.database || {})
  .map(([key, value]) => `${key}=${value}`)
  .join('\n')}

# =================================
# APPLICATION SECURITY
# =================================
${Object.entries(config.security || {})
  .map(([key, value]) => `${key}=${value}`)
  .join('\n')}

# =================================
# INFUZE.CLOUD DEPLOYMENT
# =================================
INFUZE_API_KEY=\${INFUZE_API_KEY}
INFUZE_PROJECT_ID=the-best-nexus-letters
INFUZE_REGION=london-1
INFUZE_API_URL=https://api.infuze.cloud
INFUZE_ENVIRONMENT=${filename}

# =================================
# EXTERNAL SERVICES
# =================================
${Object.entries(config.services || {})
  .map(([key, value]) => `${key}=${value}`)
  .join('\n')}

# =================================
# MONITORING & ANALYTICS
# =================================
${Object.entries(config.monitoring || {})
  .map(([key, value]) => `${key}=${value}`)
  .join('\n')}
`;

    return envContent;
  }

  generateGitHubSecretsYaml(config) {
    const secrets = {
      // Infuze Configuration
      INFUZE_API_KEY:
        'efc4c4f47de77f9690ca7eaa5017936464b35cec859eb9e9e9d94130206a7e82',
      INFUZE_SSH_PRIVATE_KEY: '${SSH_PRIVATE_KEY_CONTENT}',

      // Database Configuration
      ...config.database,

      // Application Security
      ...config.security,

      // External Services
      ...config.services,

      // Monitoring
      ...config.monitoring,
    };

    return `# GitHub Repository Secrets Configuration
# Copy these to: Settings → Secrets and variables → Actions → Secrets

secrets:
${Object.entries(secrets)
  .filter(([_, value]) => value && value !== 'undefined')
  .map(([key, value]) => `  ${key}: "${value}"`)
  .join('\n')}

# GitHub Repository Variables Configuration  
# Copy these to: Settings → Secrets and variables → Actions → Variables

variables:
  INFUZE_PROJECT_ID: "the-best-nexus-letters"
  INFUZE_REGION: "london-1" 
  INFUZE_API_URL: "https://api.infuze.cloud"
  NODE_VERSION: "18.x"
  PNPM_VERSION: "8.x"
  NEXT_PUBLIC_APP_URL_PRODUCTION: "https://thebestnexusletters.com"
  NEXT_PUBLIC_APP_URL_STAGING: "https://staging.thebestnexusletters.com"
`;
  }

  generateSetupScript(config) {
    return `#!/bin/bash
# =================================
# Automated Production Setup Script
# =================================
# This script sets up the production environment on your Infuze server

set -e  # Exit on any error

echo "🚀 Starting production server setup..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18.x
echo "📥 Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install pnpm
echo "📥 Installing pnpm..."
npm install -g pnpm

# Install PM2 for process management
echo "📥 Installing PM2..."
npm install -g pm2

# Install Nginx
echo "📥 Installing Nginx..."
apt install -y nginx

# Configure firewall
echo "🔥 Configuring firewall..."
ufw allow 22   # SSH
ufw allow 80   # HTTP
ufw allow 443  # HTTPS
ufw allow 3000 # Next.js (temporary)
ufw --force enable

# Create application directory
echo "📁 Setting up application directory..."
mkdir -p /var/www/thebestnexusletters
chown -R $USER:$USER /var/www/thebestnexusletters

# Create environment file
echo "🔧 Creating environment configuration..."
cat > /var/www/thebestnexusletters/.env.production << 'EOF'
${this.generateEnvFile(
  {
    database: config.database,
    security: config.security,
    services: config.services,
    monitoring: config.monitoring,
  },
  'production'
)}
EOF

# Configure Nginx
echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/thebestnexusletters << 'EOF'
server {
    listen 80;
    server_name thebestnexusletters.com www.thebestnexusletters.com;
    
    # Redirect www to non-www
    if ($host = www.thebestnexusletters.com) {
        return 301 http://thebestnexusletters.com$request_uri;
    }
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health check endpoint
    location /api/health {
        proxy_pass http://localhost:3000/api/health;
        access_log off;
    }
}
EOF

# Enable Nginx site
ln -sf /etc/nginx/sites-available/thebestnexusletters /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# Configure PM2 ecosystem
echo "⚙️  Configuring PM2 ecosystem..."
cat > /var/www/thebestnexusletters/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'thebestnexusletters',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/thebestnexusletters',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/thebestnexusletters-error.log',
    out_file: '/var/log/pm2/thebestnexusletters-out.log',
    log_file: '/var/log/pm2/thebestnexusletters.log',
    max_restarts: 3,
    restart_delay: 5000
  }]
};
EOF

# Create PM2 log directory
mkdir -p /var/log/pm2

# Set up PM2 startup
pm2 startup systemd -u $USER --hp $HOME
pm2 save

echo "✅ Production server setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Deploy your application code to /var/www/thebestnexusletters"
echo "2. Run: cd /var/www/thebestnexusletters && pnpm install && pnpm run build"
echo "3. Start with PM2: pm2 start ecosystem.config.js"
echo "4. Check status: pm2 status"
echo "5. View logs: pm2 logs thebestnexusletters"
echo ""
echo "🌐 Your application will be available at: http://$(curl -s ifconfig.me)"
`;
  }

  async ensureDirectories() {
    const dirs = [this.configDir, this.templatesDir, this.outputDir];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  async run() {
    this.log('\n🚀 Production Environment Setup Wizard', 'bright');
    this.log('===============================================', 'cyan');

    if (this.dryRun) {
      this.log(
        'Running in DRY RUN mode - no files will be written\n',
        'yellow'
      );
    }

    try {
      await this.ensureDirectories();

      // Collect configuration
      const database = await this.collectSupabaseConfig();
      const security = await this.collectApplicationSecrets();
      const services = await this.collectOptionalServices();
      const monitoring = {}; // Can be extended later

      const fullConfig = { database, security, services, monitoring };

      // Generate files
      this.log('\n📝 Generating configuration files...', 'blue');

      const productionEnv = this.generateEnvFile(fullConfig, 'production');
      const stagingEnv = this.generateEnvFile(fullConfig, 'staging');
      const githubSecrets = this.generateGitHubSecretsYaml(fullConfig);
      const setupScript = this.generateSetupScript(fullConfig);

      if (!this.dryRun) {
        // Write files
        fs.writeFileSync(
          path.join(this.outputDir, '.env.production'),
          productionEnv
        );
        fs.writeFileSync(path.join(this.outputDir, '.env.staging'), stagingEnv);
        fs.writeFileSync(
          path.join(this.outputDir, 'github-secrets.yml'),
          githubSecrets
        );
        fs.writeFileSync(
          path.join(this.outputDir, 'server-setup.sh'),
          setupScript
        );
        fs.chmodSync(path.join(this.outputDir, 'server-setup.sh'), '755');

        this.log('\n✅ Configuration files generated successfully!', 'green');
        this.log(`📁 Files saved to: ${this.outputDir}`, 'cyan');
      }

      // Display summary
      this.log('\n📋 Generated Files:', 'blue');
      this.log(
        `  • .env.production     - Production environment variables`,
        'cyan'
      );
      this.log(
        `  • .env.staging        - Staging environment variables`,
        'cyan'
      );
      this.log(
        `  • github-secrets.yml  - GitHub repository secrets/variables`,
        'cyan'
      );
      this.log(
        `  • server-setup.sh     - Automated server setup script`,
        'cyan'
      );

      this.log('\n🔧 Next Steps:', 'yellow');
      this.log('1. Copy secrets from github-secrets.yml to GitHub repository');
      this.log('2. Upload server-setup.sh to your Infuze server');
      this.log('3. Run: chmod +x server-setup.sh && sudo ./server-setup.sh');
      this.log('4. Deploy your application');

      this.log('\n🎉 Production environment setup complete!', 'green');
    } catch (error) {
      this.log(`\n💥 Error: ${error.message}`, 'red');
      process.exit(1);
    }
  }

  showHelp() {
    this.log(
      `
🚀 Production Environment Setup Wizard

This script helps you configure your production environment for The Best Nexus Letters.

Usage:
  node scripts/setup-production-env.js [options]

Options:
  --non-interactive    Run without prompts (use defaults)
  --dry-run           Show what would be generated without writing files
  --help              Show this help message

Examples:
  node scripts/setup-production-env.js                    # Interactive setup
  node scripts/setup-production-env.js --dry-run          # Preview generation
  node scripts/setup-production-env.js --non-interactive  # Automated setup

Generated Files:
  • .env.production     - Production environment variables
  • .env.staging        - Staging environment variables  
  • github-secrets.yml  - GitHub repository configuration
  • server-setup.sh     - Automated server setup script

`,
      'cyan'
    );
  }
}

// Main execution
if (require.main === module) {
  const setup = new ProductionEnvSetup();

  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    setup.showHelp();
  } else {
    setup.run().catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
  }
}

module.exports = { ProductionEnvSetup };
