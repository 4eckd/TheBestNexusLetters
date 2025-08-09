---
title: Operations Runbook
description: Production deployment, monitoring, and incident response procedures
---

# Operations Runbook

This runbook provides operational procedures for **The Best Nexus Letters** platform, including deployment, monitoring, incident response, and maintenance tasks.

!!! info "Audience"
    This document is intended for DevOps engineers, site reliability engineers, and platform maintainers.

## 🚀 Deployment Procedures

### Production Deployment

#### Pre-deployment Checklist

- [ ] All tests pass in CI/CD pipeline
- [ ] Security scan completed successfully
- [ ] Database migrations reviewed and approved
- [ ] Feature flags configured (if applicable)
- [ ] Rollback plan prepared
- [ ] Stakeholders notified

#### Deployment Steps

1. **Trigger Deployment**
   ```bash
   # Create and push release tag
   git tag -a v1.2.3 -m "Release version 1.2.3"
   git push origin v1.2.3
   ```

2. **Monitor Deployment**
   - Watch GitHub Actions workflow
   - Verify Vercel deployment status
   - Check application health endpoints

3. **Post-deployment Verification**
   ```bash
   # Health check
   curl https://thebestnexusletters.com/api/health
   
   # Authentication test
   curl https://thebestnexusletters.com/api/auth/session
   
   # Database connectivity
   curl https://thebestnexusletters.com/api/status
   ```

4. **Rollback Procedure** (if needed)
   ```bash
   # Revert to previous version in Vercel dashboard
   # Or redeploy previous Git commit
   git revert HEAD
   git push origin main
   ```

### Staging Deployment

Every push to `main` branch automatically deploys to staging:

- **URL**: https://staging.thebestnexusletters.com
- **Purpose**: Final testing before production
- **Auto-deploy**: Yes (on main branch push)

### Database Migrations

#### Production Migration Process

```bash
# 1. Create migration (in development)
pnpm run supabase:migration new migration_name

# 2. Test migration locally
pnpm run supabase:reset
pnpm run supabase:migrate

# 3. Apply to staging
# (Automatic via CI/CD)

# 4. Apply to production
# (Automatic via CD pipeline when tagged)
```

#### Emergency Migration Rollback

```sql
-- Connect to production database
-- Restore from backup or manual rollback
-- Document in incident report
```

## 📊 Monitoring & Alerting

### Key Metrics

| Metric | Threshold | Alert Channel |
|--------|-----------|---------------|
| **Response Time** | > 2s (95th percentile) | Slack #alerts |
| **Error Rate** | > 1% | Slack #critical |
| **Availability** | < 99.9% | PagerDuty |
| **Database CPU** | > 80% | Email |
| **Memory Usage** | > 85% | Slack #alerts |

### Health Endpoints

- **Application**: `/api/health`
- **Database**: `/api/health/database`
- **Authentication**: `/api/health/auth`
- **External Services**: `/api/health/services`

### Monitoring Tools

- **Application Performance**: Vercel Analytics
- **Database**: Supabase Dashboard
- **Error Tracking**: Built-in error boundaries
- **Uptime**: Vercel monitoring
- **Logs**: Vercel Function Logs

### Dashboard Access

- **Vercel Dashboard**: [dashboard.vercel.com](https://dashboard.vercel.com)
- **Supabase Dashboard**: [app.supabase.com](https://app.supabase.com)
- **GitHub Actions**: Repository Actions tab

## 🚨 Incident Response

### Severity Levels

#### Critical (P0)
- Complete service outage
- Data loss or corruption
- Security breach
- **Response Time**: Immediate
- **Escalation**: All hands on deck

#### High (P1)
- Significant feature unavailable
- Performance degradation affecting users
- **Response Time**: Within 1 hour
- **Escalation**: On-call engineer + team lead

#### Medium (P2)
- Minor feature issues
- Non-critical bugs
- **Response Time**: Within 4 hours
- **Escalation**: Next business day

#### Low (P3)
- Enhancement requests
- Documentation issues
- **Response Time**: Within 1 week
- **Escalation**: Product backlog

### Incident Response Process

1. **Detection**
   - Monitoring alert
   - User report
   - Manual discovery

2. **Assessment**
   - Determine severity level
   - Assess impact and scope
   - Estimate affected users

3. **Response**
   ```bash
   # Quick health checks
   curl https://thebestnexusletters.com/api/health
   
   # Check service status
   curl https://thebestnexusletters.com/api/status
   
   # Review recent deployments
   git log --oneline -10
   ```

4. **Communication**
   - Update status page
   - Notify stakeholders
   - Post in incident channel

5. **Resolution**
   - Implement fix
   - Test thoroughly
   - Deploy fix
   - Verify resolution

6. **Post-mortem**
   - Document timeline
   - Root cause analysis
   - Action items
   - Process improvements

### Common Issues & Solutions

#### Application Won't Start

```bash
# Check environment variables
curl https://api.vercel.com/v1/projects/[project-id]/env

# Check build logs
vercel logs [deployment-url]

# Verify database connection
# Check Supabase dashboard for issues
```

#### High Response Times

```bash
# Check recent deployments
git log --oneline -5

# Review function performance
# Check Vercel Analytics dashboard

# Database performance
# Review Supabase performance metrics
```

#### Authentication Issues

```bash
# Test auth endpoints
curl -X POST https://thebestnexusletters.com/api/auth/signin

# Check Supabase Auth logs
# Verify JWT secret configuration
# Check session management
```

#### Database Connectivity

```bash
# Test database connection
curl https://thebestnexusletters.com/api/health/database

# Check Supabase status
# Review connection pool settings
# Verify Row Level Security policies
```

## 🔧 Maintenance Tasks

### Daily Tasks

- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Verify backup completion
- [ ] Monitor disk usage

### Weekly Tasks

- [ ] Review security alerts
- [ ] Update dependencies (automated)
- [ ] Performance trend analysis
- [ ] Capacity planning review

### Monthly Tasks

- [ ] Security vulnerability scan
- [ ] Database maintenance
- [ ] Backup verification
- [ ] Cost optimization review

### Quarterly Tasks

- [ ] Disaster recovery test
- [ ] Performance load testing
- [ ] Security audit
- [ ] Architecture review

### Automated Maintenance

The following tasks are automated via GitHub Actions:

- **Dependency Updates**: Dependabot PRs
- **Security Scanning**: Snyk integration
- **Performance Testing**: Lighthouse CI
- **Backup Verification**: Daily automated checks

## 💾 Backup & Recovery

### Database Backups

- **Frequency**: Daily automated backups
- **Retention**: 30 days
- **Location**: Supabase managed backups
- **Verification**: Automated backup validation

### Application Backups

- **Code**: Git repository (distributed backup)
- **Configuration**: Environment variables backup
- **Assets**: Supabase Storage with versioning

### Recovery Procedures

#### Database Recovery

```bash
# Point-in-time recovery via Supabase dashboard
# 1. Navigate to Supabase project
# 2. Go to Settings > Database
# 3. Select backup point
# 4. Restore database
# 5. Verify data integrity
```

#### Application Recovery

```bash
# Rollback to previous version
git checkout [previous-commit]
git push origin main --force

# Or use Vercel rollback
vercel rollback [deployment-id]
```

## 🔐 Security Procedures

### Security Monitoring

- **Failed login attempts**: Monitor auth logs
- **Unusual traffic patterns**: Review analytics
- **API abuse**: Rate limiting alerts
- **Database access**: Audit logs review

### Security Incident Response

1. **Immediate Actions**
   - Block suspicious IPs
   - Revoke compromised keys
   - Enable maintenance mode if needed

2. **Investigation**
   - Review access logs
   - Check for data exposure
   - Document timeline

3. **Recovery**
   - Patch vulnerabilities
   - Update credentials
   - Strengthen security measures

4. **Communication**
   - Notify affected users
   - Update security policies
   - File incident report

### Regular Security Tasks

- **Weekly**: Review access logs
- **Monthly**: Rotate API keys
- **Quarterly**: Security assessment
- **Annually**: Penetration testing

## 📞 Contact Information

### On-call Rotation

| Role | Primary | Secondary |
|------|---------|-----------|
| **Platform Lead** | @platform-lead | @platform-backup |
| **Database Admin** | @db-admin | @db-backup |
| **Security Lead** | @security-lead | @security-backup |

### Escalation Matrix

1. **On-call Engineer** (First response)
2. **Team Lead** (If not resolved in 30 minutes)
3. **Platform Lead** (For critical issues)
4. **CTO** (For business-critical outages)

### Emergency Contacts

- **Platform Team**: platform-team@company.com
- **Security Team**: security@company.com
- **Management**: management@company.com

## 📋 Runbook Checklist

### Pre-incident Preparation

- [ ] Runbook reviewed and updated monthly
- [ ] All team members familiar with procedures
- [ ] Access credentials verified
- [ ] Monitoring alerts configured
- [ ] Escalation contacts updated

### During Incident

- [ ] Incident severity assessed
- [ ] Stakeholders notified
- [ ] Status page updated
- [ ] Timeline documented
- [ ] Actions logged

### Post-incident

- [ ] Service restored and verified
- [ ] Post-mortem scheduled
- [ ] Action items created
- [ ] Runbook updated if needed
- [ ] Lessons learned shared

---

## 📚 Additional Resources

- **[Architecture Overview](../architecture/overview.md)** - System design
- **[Deployment Guide](../deployment/overview.md)** - Detailed deployment docs
- **[Monitoring Guide](monitoring.md)** - Monitoring setup
- **[Security Guide](../architecture/security.md)** - Security measures

**Last Updated**: 2025-08-08  
**Maintained By**: Platform Engineering Team
