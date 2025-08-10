# Infuze.cloud Deployment Guide

This guide covers deploying The Best Nexus Letters to Infuze.cloud, a high-performance, cost-effective cloud hosting platform.

## Overview

Infuze.cloud provides:

- **80% cost savings** compared to traditional cloud providers
- **1:1 resource allocation** with dedicated CPU cores
- **99.99% uptime** with premium hardware
- **Enterprise-grade security** with advanced threat protection
- **London datacenter** with 25Gbit/s networking

## Prerequisites

1. **Node.js 18+** installed locally
2. **pnpm** package manager
3. **Git** with clean working directory
4. **Infuze account** and CLI access
5. **Domain name** (optional, for custom domains)

## Quick Start

### 1. Install Infuze CLI

The deployment script will automatically install the Infuze CLI if it's missing:

```bash
pnpm install -g infuze
```

### 2. Configure Environment Variables

Set up your production environment variables in the Infuze dashboard or CLI:

```bash
# Required for production
SUPABASE_URL=your-production-supabase-url
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
NEXTAUTH_SECRET=your-nextauth-secret
DISCOURSE_SECRET=your-discourse-secret
DISCOURSE_SSO_SECRET=your-discourse-sso-secret
```

### 3. Deploy to Staging

Test your deployment on staging first:

```bash
pnpm run deploy:staging
```

### 4. Deploy to Production

Once staging looks good, deploy to production:

```bash
pnpm run deploy:production
```

## Deployment Scripts

### Available Commands

| Command                            | Description                          |
| ---------------------------------- | ------------------------------------ |
| `pnpm run deploy:production`       | Deploy to production                 |
| `pnpm run deploy:staging`          | Deploy to staging                    |
| `pnpm run deploy:dry`              | Preview deployment without executing |
| `pnpm run deploy:infuze --verbose` | Deploy with detailed output          |

### Script Features

The deployment script automatically:

1. ✅ **Checks prerequisites** (Node.js, pnpm, Infuze CLI)
2. 🧪 **Runs pre-deployment checks** (type-check, lint, test, build)
3. 🧹 **Cleans build artifacts**
4. 📦 **Installs dependencies** with frozen lockfile
5. 🏗️ **Builds the application**
6. 🚀 **Deploys to Infuze.cloud**
7. 🔍 **Runs post-deployment health checks**
8. 📊 **Generates deployment summary**

## Configuration

### Infuze Configuration File

The `infuze.config.js` file contains all deployment settings:

```javascript
module.exports = {
  // Instance specifications
  instance: {
    type: 'core-2', // 2 vCPU cores
    memory: '4GB', // Dedicated RAM
    storage: '40GB', // NVMe SSD
    region: 'london-1', // London datacenter
  },

  // Custom domains
  domains: [
    {
      name: 'thebestnexusletters.com',
      ssl: true,
      redirect: { www: true, https: true },
    },
  ],

  // Build configuration
  build: {
    commands: {
      install: 'pnpm install --frozen-lockfile',
      build: 'pnpm run build',
      start: 'pnpm run start',
    },
  },

  // Security and performance
  network: {
    cdn: { enabled: true },
    security: { rateLimit: { enabled: true } },
  },
};
```

### Environment-Specific Settings

#### Production

- **Instance**: core-2 (2 vCPU, 4GB RAM)
- **Domain**: thebestnexusletters.com
- **SSL**: Enabled with auto-renewal
- **CDN**: Enabled for global distribution
- **Monitoring**: Full monitoring and alerts

#### Staging

- **Instance**: core-1 (1 vCPU, 2GB RAM)
- **Domain**: staging.thebestnexusletters.com
- **Auto-deploy**: On push to `develop` branch
- **Cost-optimized**: Smaller instance for testing

## Deployment Process

### Pre-deployment Checks

Before deployment, the script runs:

```bash
# Type checking
pnpm run type-check

# Code linting
pnpm run lint

# Unit tests
pnpm run test:run

# Build verification
pnpm run build
```

### Health Checks

After deployment, health checks verify:

- ✅ Application is responding
- ✅ Health endpoint returns 200
- ✅ Database connectivity
- ✅ External services status
- ✅ Memory usage is healthy

### Rollback Strategy

If deployment fails:

1. **Automatic rollback** to previous version
2. **Health checks** identify issues quickly
3. **Zero downtime** during deployments
4. **Deployment logs** for debugging

## Monitoring & Alerting

### Built-in Monitoring

Infuze.cloud provides:

- **Real-time metrics** (CPU, memory, network)
- **Application logs** with 7-day retention
- **Uptime monitoring** with 99.99% SLA
- **Performance insights** and bottleneck detection

### Alert Configuration

Alerts are triggered for:

- **High CPU usage** (>90% for 5 minutes)
- **High memory usage** (>95% for 2 minutes)
- **Slow response times** (>5 seconds for 1 minute)
- **High error rates** (>5% for 1 minute)
- **Service downtime**

### Custom Monitoring

Health check endpoint: `/api/health`

```javascript
// Example health check response
{
  "status": "healthy",
  "timestamp": "2024-01-09T12:00:00Z",
  "uptime": 3600,
  "version": "1.0.0",
  "checks": [
    { "name": "database", "status": "pass" },
    { "name": "external_services", "status": "pass" },
    { "name": "memory", "status": "pass" }
  ]
}
```

## Cost Optimization

### Instance Sizing

| Environment | Instance | vCPU | RAM | Storage | Cost/month\* |
| ----------- | -------- | ---- | --- | ------- | ------------ |
| Production  | core-2   | 2    | 4GB | 40GB    | ~$40         |
| Staging     | core-1   | 1    | 2GB | 20GB    | ~$20         |
| Preview     | micro    | 1    | 1GB | 10GB    | ~$10         |

\*Estimated costs - 80% lower than traditional providers

### Automatic Scaling

- **Scale down** during low traffic (2 AM - 6 AM UTC)
- **Scale up** during peak hours automatically
- **Preview deployments** auto-cleanup after 7 days
- **Build artifact** cleanup keeps only last 3 builds

### Storage Optimization

- **Compression** enabled for all assets
- **CDN caching** reduces bandwidth costs
- **Log retention** limited to essential debugging period
- **Temporary files** cleaned automatically

## Security

### Network Security

- **DDoS protection** with automatic mitigation
- **Rate limiting** per IP address
- **SSL/TLS encryption** with automatic renewal
- **Security headers** for XSS and CSRF protection

### Application Security

- **Environment variables** encrypted at rest
- **Secrets management** with role-based access
- **Network isolation** between environments
- **Regular security updates** and patches

### Compliance

- **SOC 2 Type II** compliant infrastructure
- **GDPR** compliant data handling
- **Bank-level encryption** for data in transit
- **Audit logging** for security events

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Check build locally
pnpm run build

# View detailed logs
pnpm run deploy:infuze --verbose

# Skip checks (not recommended)
pnpm run deploy:infuze --skip-checks
```

#### Environment Variable Issues

```bash
# Verify environment variables
infuze env list --env production

# Update environment variable
infuze env set VARIABLE_NAME=value --env production

# View application logs
infuze logs --env production --tail
```

#### Performance Issues

```bash
# Check resource usage
infuze metrics --env production

# View health check status
curl https://thebestnexusletters.com/api/health

# Scale up instance if needed
infuze scale --instances 3 --env production
```

### Getting Help

1. **Check deployment logs**: `infuze logs --env production`
2. **View health status**: Visit `/api/health` endpoint
3. **Contact support**: Infuze.cloud support portal
4. **Community help**: Project GitHub discussions

## Advanced Configuration

### Custom Domain Setup

1. **Add domain** in Infuze dashboard
2. **Update DNS** records to point to Infuze
3. **Enable SSL** with automatic certificate renewal
4. **Configure redirects** (www → non-www, HTTP → HTTPS)

### Database Integration

```javascript
// Optional: Use Infuze managed PostgreSQL
database: {
  type: 'postgresql',
  version: '15',
  backup: { enabled: true, retention: '7d' },
  pooling: { maxConnections: 20 },
}
```

### Multi-region Deployment

```javascript
// Future: Deploy to multiple regions
regions: ['london-1', 'us-east-1'],
loadBalancing: { strategy: 'nearest' },
```

## Migration Guide

### From Vercel

1. **Export** environment variables
2. **Update** build commands in `infuze.config.js`
3. **Test deployment** on staging
4. **Update DNS** to point to Infuze
5. **Monitor** performance and costs

### From AWS/GCP

1. **Review** current infrastructure costs
2. **Right-size** Infuze instances (typically much smaller needed)
3. **Migrate database** if using managed services
4. **Test thoroughly** before switching DNS
5. **Enjoy 80% cost savings** 🎉

## Best Practices

### Development Workflow

1. **Develop** on feature branches
2. **Deploy** to staging on merge to `develop`
3. **Test** thoroughly on staging
4. **Deploy** to production from `main` branch
5. **Monitor** post-deployment metrics

### Performance Optimization

- **Enable CDN** for static assets
- **Optimize images** with Next.js Image component
- **Use caching** strategies for API responses
- **Monitor** Core Web Vitals
- **Set up** performance budgets

### Security Hardening

- **Regular** security updates
- **Monitor** for vulnerabilities
- **Use** environment-specific secrets
- **Enable** all security headers
- **Audit** access logs regularly

---

## Summary

Infuze.cloud provides a powerful, cost-effective platform for hosting The Best Nexus Letters with:

- ✅ **Simple deployment** with automated scripts
- ✅ **High performance** with dedicated resources
- ✅ **Cost savings** of up to 80%
- ✅ **Enterprise security** and compliance
- ✅ **Excellent monitoring** and alerting

The deployment scripts handle all the complexity, making it as easy as running `pnpm run deploy:production` to get your application live on a premium cloud infrastructure.

For questions or issues, refer to the troubleshooting section or contact the development team.
