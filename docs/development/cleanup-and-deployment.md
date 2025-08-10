# Cleanup and Deployment Scripts

This document provides an overview of the cleanup and deployment automation scripts for The Best Nexus Letters project.

## 🧹 Cleanup Scripts

### Overview

We have created comprehensive cleanup scripts to maintain a clean development environment by removing build artifacts, cache files, temporary files, and other unnecessary files that accumulate during development.

### Available Scripts

| Script                  | Platform       | Description                 |
| ----------------------- | -------------- | --------------------------- |
| `node scripts/clean.js` | Cross-platform | Main Node.js cleanup script |
| `scripts/clean.bat`     | Windows        | Batch wrapper for Windows   |
| `scripts/clean.ps1`     | PowerShell     | PowerShell implementation   |

### Package.json Commands

```json
{
  "clean": "node scripts/clean.js",
  "clean:dry": "node scripts/clean.js --dry-run",
  "clean:deep": "node scripts/clean.js --deep",
  "clean:verbose": "node scripts/clean.js --verbose"
}
```

### Usage Examples

```bash
# Basic cleanup (build and cache directories)
pnpm run clean

# Preview what would be cleaned without deleting
pnpm run clean:dry

# Deep clean including node_modules
pnpm run clean:deep

# Verbose output showing detailed progress
pnpm run clean:verbose

# Combine options for detailed dry run
node scripts/clean.js --dry-run --verbose
```

### What Gets Cleaned

#### Build Directories

- `.next/` - Next.js build output
- `build/` - Generic build directory
- `dist/` - Distribution files
- `out/` - Next.js static export
- `site/` - MkDocs build output
- `storybook-static/` - Storybook build
- `.vercel/`, `.netlify/` - Deployment artifacts

#### Cache Directories

- `node_modules/.cache/` - NPM/Node cache
- `.turbo/` - Turbo cache
- `.swc/` - SWC compiler cache
- `.next/cache/` - Next.js cache
- `coverage/` - Test coverage reports
- `.vitest/` - Vitest cache
- `playwright-report/`, `playwright-results/` - E2E test artifacts

#### Temporary Files

- `*.log` - Log files
- `.DS_Store` - macOS metadata
- `Thumbs.db` - Windows thumbnails
- `desktop.ini` - Windows folder config
- `tmp/`, `temp/` - Temporary directories

#### Development Artifacts

- `*.tsbuildinfo` - TypeScript incremental build info
- `.eslintcache` - ESLint cache
- `.prettiercache` - Prettier cache
- `.env.*.bak` - Backup environment files

#### Package Manager Artifacts (--deep flag)

- `node_modules/` - Dependencies
- `.pnpm-store/` - PNPM cache
- `.yarn/cache/` - Yarn cache
- `*debug.log*` - Package manager logs

### Features

✅ **Cross-platform** - Works on Windows, macOS, and Linux  
✅ **Dry run mode** - Preview changes before applying  
✅ **Verbose output** - Detailed progress information  
✅ **Size calculation** - Shows space freed  
✅ **Error handling** - Graceful failure with detailed errors  
✅ **Glob pattern support** - Advanced file matching  
✅ **Safety checks** - Prevents accidental deletions

### Example Output

```
🚀 Starting cleanup...
Running in DRY RUN mode - no files will actually be deleted

🧹 Cleaning Build directories...
[DRY RUN] Would delete: .next (229.07 MB)
[DRY RUN] Would delete: site (3.82 MB)

🧹 Cleaning Cache directories...
[DRY RUN] Would delete: .next/cache (172.38 MB)
[DRY RUN] Would delete: playwright-report (453.04 KB)

📊 Cleanup Summary
Files/directories processed: 16
Total space that would be freed: 407.25 MB
```

## 🚀 Infuze.cloud Deployment

### Overview

We've configured deployment to Infuze.cloud, a high-performance, cost-effective cloud hosting platform offering 80% cost savings compared to traditional providers.

### Deployment Commands

```json
{
  "deploy:production": "node scripts/deploy-infuze.js",
  "deploy:staging": "node scripts/deploy-infuze.js --staging",
  "deploy:dry": "node scripts/deploy-infuze.js --dry-run",
  "deploy:infuze": "node scripts/deploy-infuze.js"
}
```

### Usage Examples

```bash
# Deploy to production
pnpm run deploy:production

# Deploy to staging
pnpm run deploy:staging

# Preview deployment without executing
pnpm run deploy:dry

# Verbose deployment with detailed output
node scripts/deploy-infuze.js --verbose

# Force deployment with uncommitted changes
node scripts/deploy-infuze.js --force --staging
```

### Deployment Process

The deployment script automatically:

1. **Prerequisites Check**
   - ✅ Node.js 18+ version
   - ✅ PNPM package manager
   - ✅ Infuze CLI (auto-installs if missing)
   - ✅ Clean git working directory
   - ✅ Configuration file exists

2. **Pre-deployment Checks**
   - ✅ TypeScript type checking (`pnpm run type-check`)
   - ✅ ESLint code quality (`pnpm run lint`)
   - ✅ Unit tests (`pnpm run test:run`)
   - ✅ Build verification (`pnpm run build`)

3. **Deployment Steps**
   - 🧹 Clean build artifacts
   - 📦 Install dependencies with frozen lockfile
   - 🏗️ Build application
   - 🚀 Deploy to Infuze.cloud
   - 🔍 Post-deployment health checks
   - 📊 Generate deployment summary

### Infrastructure Configuration

#### Production Environment

- **Instance**: core-2 (2 vCPU, 4GB RAM)
- **Storage**: 40GB NVMe SSD
- **Region**: London datacenter
- **Domain**: thebestnexusletters.com
- **SSL**: Auto-renewal enabled
- **CDN**: Global distribution enabled
- **Monitoring**: Full alerts and metrics

#### Staging Environment

- **Instance**: core-1 (1 vCPU, 2GB RAM)
- **Storage**: 20GB NVMe SSD
- **Domain**: staging.thebestnexusletters.com
- **Auto-deploy**: On push to `develop` branch
- **Cost-optimized**: Smaller instance for testing

### Health Checks

Post-deployment verification includes:

- ✅ Application responding (HTTP 200)
- ✅ Health endpoint (`/api/health`)
- ✅ Database connectivity
- ✅ External services status
- ✅ Memory usage monitoring
- ✅ Response time validation

### Cost Optimization

| Environment | Instance | vCPU | RAM | Storage | Estimated Cost/month |
| ----------- | -------- | ---- | --- | ------- | -------------------- |
| Production  | core-2   | 2    | 4GB | 40GB    | ~$40                 |
| Staging     | core-1   | 1    | 2GB | 20GB    | ~$20                 |
| Preview     | micro    | 1    | 1GB | 10GB    | ~$10                 |

**Total estimated monthly cost: ~$70** (80% less than traditional providers)

### Security Features

- 🛡️ **DDoS protection** with automatic mitigation
- 🔐 **Rate limiting** per IP address (1000 RPM)
- 🔒 **SSL/TLS encryption** with auto-renewal
- 🚫 **Security headers** for XSS/CSRF protection
- 🔑 **Secrets management** with encryption at rest
- 🌐 **Network isolation** between environments

### Monitoring & Alerting

#### Metrics Tracked

- CPU usage (alert if >90% for 5 minutes)
- Memory usage (alert if >95% for 2 minutes)
- Response times (alert if >5 seconds for 1 minute)
- Error rates (alert if >5% for 1 minute)
- Uptime (99.99% SLA)

#### Health Check Endpoint

The `/api/health` endpoint provides detailed system status:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-09T12:00:00Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "production",
  "checks": [
    { "name": "database", "status": "pass" },
    { "name": "external_services", "status": "pass" },
    { "name": "filesystem", "status": "pass" },
    { "name": "memory", "status": "pass" }
  ],
  "system": {
    "nodejs": "v18.17.0",
    "platform": "linux",
    "memory": {
      "used": 125829120,
      "total": 4294967296
    }
  }
}
```

## 🔧 Configuration Files

### Infuze Configuration (`infuze.config.js`)

```javascript
module.exports = {
  name: 'the-best-nexus-letters',
  version: '1.0.0',

  instance: {
    type: 'core-2',
    memory: '4GB',
    storage: '40GB',
    region: 'london-1',
  },

  domains: [
    {
      name: 'thebestnexusletters.com',
      ssl: true,
      redirect: { www: true, https: true },
    },
  ],

  build: {
    commands: {
      install: 'pnpm install --frozen-lockfile',
      build: 'pnpm run build',
      start: 'pnpm run start',
    },
  },

  monitoring: {
    alerts: { enabled: true },
    logging: { retention: '7d' },
  },
};
```

### Deployment Ignore (`.infuzeignore`)

Excludes development files from deployment:

- Development environment files
- Test artifacts and reports
- IDE configurations
- Cache and temporary files
- Documentation builds
- Git and CI/CD files

## 📁 File Structure

```
scripts/
├── clean.js              # Main cleanup script (Node.js)
├── clean.bat             # Windows batch wrapper
├── clean.ps1             # PowerShell implementation
└── deploy-infuze.js      # Infuze.cloud deployment script

docs/
├── deployment/
│   └── infuze-cloud.md   # Detailed deployment guide
└── development/
    └── cleanup-and-deployment.md  # This document

infuze.config.js          # Infuze deployment configuration
.infuzeignore             # Files to exclude from deployment

src/app/api/health/       # Health check endpoint
```

## 🎯 Best Practices

### Development Workflow

1. **Regular cleanup** - Run `pnpm run clean` weekly
2. **Dry run first** - Always preview with `--dry-run`
3. **Staging first** - Test on staging before production
4. **Monitor deployments** - Check health endpoints post-deploy
5. **Clean before deploy** - Scripts automatically clean artifacts

### Cleanup Guidelines

- Use **dry run mode** before actual cleanup
- Run **deep clean** monthly to clear node_modules
- Check **verbose output** when troubleshooting
- Monitor **space freed** to track effectiveness
- Keep **logs** for debugging cleanup issues

### Deployment Guidelines

- Always **test locally** before deploying
- Use **staging environment** for integration testing
- Monitor **health checks** after deployment
- Keep **deployment logs** for troubleshooting
- Set up **alert notifications** for production issues

## 🚨 Troubleshooting

### Common Cleanup Issues

1. **Permission errors** - Run as administrator on Windows
2. **Files in use** - Close development servers and editors
3. **Glob dependency missing** - Run `pnpm add --save-dev glob`
4. **PowerShell execution policy** - Set execution policy if needed

### Common Deployment Issues

1. **Build failures** - Check local build with `pnpm run build`
2. **Environment variables** - Verify all required secrets are set
3. **Health check failures** - Check application logs
4. **Performance issues** - Monitor resource usage and scale if needed

## 📊 Benefits

### Cleanup Benefits

- ✅ **Free disk space** - Regularly free hundreds of MB
- ✅ **Faster builds** - Clean state improves build performance
- ✅ **Reduced conflicts** - Avoid stale cache issues
- ✅ **Better debugging** - Clean environment for troubleshooting

### Deployment Benefits

- ✅ **Cost savings** - 80% less than traditional cloud providers
- ✅ **High performance** - Dedicated resources, not shared
- ✅ **Automated process** - One command deployment
- ✅ **Zero downtime** - Rolling deployments
- ✅ **Enterprise security** - Bank-level encryption and compliance

---

## Summary

The cleanup and deployment scripts provide a robust, automated solution for maintaining clean development environments and deploying to production infrastructure. With comprehensive error handling, detailed logging, and cost-effective cloud hosting, these tools streamline the development workflow while ensuring reliable, secure deployments.

For detailed deployment information, see [`docs/deployment/infuze-cloud.md`](../deployment/infuze-cloud.md).
