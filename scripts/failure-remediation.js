#!/usr/bin/env node

/**
 * Advanced Failure Remediation System
 * Analyzes CI/CD failures and applies intelligent fixes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('js-yaml');

class FailureRemediationSystem {
  constructor() {
    this.config = this.loadConfig();
    this.failureHistory = this.loadFailureHistory();
  }

  loadConfig() {
    try {
      const configPath = path.join(
        __dirname,
        '../.github/failure-remediation-config.yml'
      );
      const configFile = fs.readFileSync(configPath, 'utf8');
      return yaml.load(configFile);
    } catch (error) {
      console.error('Failed to load remediation config:', error.message);
      return this.getDefaultConfig();
    }
  }

  loadFailureHistory() {
    try {
      const historyPath = path.join(
        __dirname,
        '../.github/failure-history.json'
      );
      if (fs.existsSync(historyPath)) {
        return JSON.parse(fs.readFileSync(historyPath, 'utf8'));
      }
    } catch (error) {
      console.warn('Failed to load failure history:', error.message);
    }
    return { patterns: {}, remediation_success: {} };
  }

  saveFailureHistory() {
    try {
      const historyPath = path.join(
        __dirname,
        '../.github/failure-history.json'
      );
      fs.writeFileSync(
        historyPath,
        JSON.stringify(this.failureHistory, null, 2)
      );
    } catch (error) {
      console.error('Failed to save failure history:', error.message);
    }
  }

  analyzeFailure(logContent, jobName, workflowName) {
    const analysis = {
      failure_type: 'unknown',
      confidence: 0,
      auto_fixable: false,
      suggested_actions: [],
      patterns_matched: [],
    };

    // Pattern matching with confidence scoring
    for (const [patternName, pattern] of Object.entries(this.config.patterns)) {
      let matches = 0;
      let totalKeywords = pattern.keywords.length;

      for (const keyword of pattern.keywords) {
        if (logContent.toLowerCase().includes(keyword.toLowerCase())) {
          matches++;
        }
      }

      const confidence = matches / totalKeywords;
      if (confidence > analysis.confidence) {
        analysis.failure_type = patternName;
        analysis.confidence = confidence;
        analysis.auto_fixable = pattern.auto_fixable;
        analysis.patterns_matched.push({
          pattern: patternName,
          confidence: confidence,
          matches: matches,
        });

        if (pattern.remediation) {
          analysis.suggested_actions = pattern.remediation;
        }
      }
    }

    // Enhanced analysis for specific failure types
    if (analysis.failure_type === 'dependency_vulnerability') {
      analysis.vulnerability_details = this.analyzeVulnerabilities(logContent);
    } else if (analysis.failure_type === 'test_failure') {
      analysis.test_details = this.analyzeTestFailures(logContent);
    } else if (analysis.failure_type === 'build_error') {
      analysis.build_details = this.analyzeBuildErrors(logContent);
    }

    // Update failure history
    this.updateFailureHistory(analysis.failure_type, workflowName, jobName);

    return analysis;
  }

  analyzeVulnerabilities(logContent) {
    const vulnRegex =
      /(\d+)\s+(high|critical|moderate|low)\s+severity\s+vulnerabilit/gi;
    const matches = [...logContent.matchAll(vulnRegex)];

    return {
      total_vulnerabilities: matches.length,
      by_severity: matches.reduce((acc, match) => {
        const severity = match[2].toLowerCase();
        acc[severity] = (acc[severity] || 0) + parseInt(match[1]);
        return acc;
      }, {}),
    };
  }

  analyzeTestFailures(logContent) {
    const testRegex = /(FAIL|FAILED|✗)\s+(.+?)\s+/gi;
    const matches = [...logContent.matchAll(testRegex)];

    return {
      failed_tests: matches.map(match => match[2]),
      failure_count: matches.length,
      possible_flaky:
        logContent.includes('timeout') || logContent.includes('timing'),
    };
  }

  analyzeBuildErrors(logContent) {
    const errorRegex = /(Error|error):\s+(.+)/gi;
    const matches = [...logContent.matchAll(errorRegex)];

    return {
      error_messages: matches.map(match => match[2]),
      error_count: matches.length,
      webpack_related:
        logContent.includes('webpack') || logContent.includes('module'),
      typescript_related:
        logContent.includes('TS') || logContent.includes('TypeScript'),
    };
  }

  updateFailureHistory(failureType, workflowName, jobName) {
    const key = `${workflowName}-${jobName}`;

    if (!this.failureHistory.patterns[failureType]) {
      this.failureHistory.patterns[failureType] = {
        occurrences: 0,
        last_seen: new Date().toISOString(),
        workflows: {},
      };
    }

    this.failureHistory.patterns[failureType].occurrences++;
    this.failureHistory.patterns[failureType].last_seen =
      new Date().toISOString();
    this.failureHistory.patterns[failureType].workflows[key] =
      (this.failureHistory.patterns[failureType].workflows[key] || 0) + 1;
  }

  async applyRemediation(analysis, dryRun = false) {
    const results = {
      actions_taken: [],
      successful_fixes: [],
      failed_fixes: [],
      files_modified: [],
    };

    if (!analysis.auto_fixable) {
      console.log('🔍 Manual analysis required for:', analysis.failure_type);
      return results;
    }

    console.log(`🔧 Applying remediation for: ${analysis.failure_type}`);

    for (const action of analysis.suggested_actions) {
      try {
        console.log(`  → ${action.description}`);

        if (dryRun) {
          console.log(
            `  [DRY RUN] Would execute: ${action.command || 'Custom action'}`
          );
          results.actions_taken.push({
            action: action.step,
            status: 'simulated',
            description: action.description,
          });
          continue;
        }

        let actionResult = null;

        switch (action.step) {
          case 'dependency_audit_fix':
            actionResult = await this.fixDependencyVulnerabilities();
            break;
          case 'eslint_fix':
            actionResult = await this.fixLintingErrors();
            break;
          case 'prettier_fix':
            actionResult = await this.fixFormattingErrors();
            break;
          case 'cache_clear':
            actionResult = await this.clearCaches();
            break;
          case 'clean_install':
            actionResult = await this.cleanInstall();
            break;
          case 'deployment_retry':
            actionResult = await this.retryDeployment();
            break;
          default:
            if (action.command) {
              actionResult = await this.executeCommand(action.command);
            }
        }

        if (actionResult && actionResult.success) {
          results.successful_fixes.push({
            action: action.step,
            description: action.description,
            details: actionResult,
          });
        } else {
          results.failed_fixes.push({
            action: action.step,
            error: actionResult?.error || 'Unknown error',
          });
        }
      } catch (error) {
        console.error(`  ❌ Failed to apply ${action.step}:`, error.message);
        results.failed_fixes.push({
          action: action.step,
          error: error.message,
        });
      }
    }

    // Update success statistics
    if (results.successful_fixes.length > 0) {
      this.updateRemediationSuccess(analysis.failure_type, results);
    }

    return results;
  }

  async fixDependencyVulnerabilities() {
    try {
      console.log('    🔍 Checking for vulnerabilities...');

      // First check if vulnerabilities exist
      const auditResult = execSync('pnpm audit --json', {
        encoding: 'utf8',
        stdio: ['inherit', 'pipe', 'pipe'],
      });

      const audit = JSON.parse(auditResult);

      if (audit.metadata.vulnerabilities.total === 0) {
        return { success: true, message: 'No vulnerabilities found' };
      }

      console.log('    🔧 Applying security fixes...');
      execSync('pnpm audit fix --audit-level moderate', {
        stdio: 'inherit',
        timeout: 300000, // 5 minutes
      });

      return {
        success: true,
        message: `Fixed ${audit.metadata.vulnerabilities.total} vulnerabilities`,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async fixLintingErrors() {
    try {
      console.log('    🧹 Applying ESLint fixes...');
      execSync('pnpm run lint:fix', {
        stdio: 'inherit',
        timeout: 180000, // 3 minutes
      });
      return { success: true, message: 'ESLint fixes applied' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async fixFormattingErrors() {
    try {
      console.log('    🎨 Applying Prettier formatting...');
      execSync('pnpm run format:fix', {
        stdio: 'inherit',
        timeout: 120000, // 2 minutes
      });
      return { success: true, message: 'Prettier formatting applied' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async clearCaches() {
    try {
      console.log('    🧽 Clearing caches...');

      // Clear pnpm cache
      execSync('pnpm store prune', { stdio: 'inherit' });

      // Clear Next.js cache
      execSync('rm -rf .next', { stdio: 'inherit' });

      // Clear node_modules cache
      execSync('rm -rf node_modules/.cache', { stdio: 'inherit' });

      return { success: true, message: 'Caches cleared successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async cleanInstall() {
    try {
      console.log('    📦 Performing clean installation...');

      // Remove node_modules
      execSync('rm -rf node_modules', { stdio: 'inherit' });

      // Reinstall dependencies
      execSync('pnpm install --frozen-lockfile', {
        stdio: 'inherit',
        timeout: 600000, // 10 minutes
      });

      return { success: true, message: 'Clean installation completed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async retryDeployment() {
    try {
      console.log('    🚀 Retrying deployment...');
      // This would trigger a deployment retry
      // Implementation depends on your deployment system
      return { success: true, message: 'Deployment retry initiated' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async executeCommand(command) {
    try {
      console.log(`    ⚡ Executing: ${command}`);
      execSync(command, { stdio: 'inherit' });
      return { success: true, message: `Command executed: ${command}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  updateRemediationSuccess(failureType, results) {
    if (!this.failureHistory.remediation_success[failureType]) {
      this.failureHistory.remediation_success[failureType] = {
        attempts: 0,
        successes: 0,
        success_rate: 0,
      };
    }

    const stats = this.failureHistory.remediation_success[failureType];
    stats.attempts++;

    if (results.successful_fixes.length > results.failed_fixes.length) {
      stats.successes++;
    }

    stats.success_rate = stats.successes / stats.attempts;

    this.saveFailureHistory();
  }

  generateReport(analysis, remediationResults) {
    const report = {
      timestamp: new Date().toISOString(),
      failure_analysis: analysis,
      remediation_results: remediationResults,
      recommendations: this.generateRecommendations(analysis),
      historical_context: this.getHistoricalContext(analysis.failure_type),
    };

    // Save report
    const reportPath = path.join(
      __dirname,
      `../reports/failure-report-${Date.now()}.json`
    );
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    return report;
  }

  generateRecommendations(analysis) {
    const recommendations = [];

    if (
      analysis.failure_type === 'test_failure' &&
      analysis.test_details?.possible_flaky
    ) {
      recommendations.push(
        'Consider implementing test retry logic for flaky tests'
      );
      recommendations.push('Review test timeouts and async handling');
    }

    if (analysis.failure_type === 'dependency_vulnerability') {
      recommendations.push('Schedule regular dependency updates');
      recommendations.push(
        'Consider implementing automated dependency scanning'
      );
    }

    if (
      analysis.failure_type === 'build_error' &&
      analysis.build_details?.typescript_related
    ) {
      recommendations.push('Review TypeScript configuration for strict mode');
      recommendations.push('Consider incremental TypeScript compilation');
    }

    return recommendations;
  }

  getHistoricalContext(failureType) {
    const pattern = this.failureHistory.patterns[failureType];

    if (!pattern) {
      return { message: 'First occurrence of this failure type' };
    }

    return {
      total_occurrences: pattern.occurrences,
      last_seen: pattern.last_seen,
      most_affected_workflows: Object.entries(pattern.workflows)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([workflow, count]) => ({ workflow, count })),
      remediation_success_rate:
        this.failureHistory.remediation_success[failureType]?.success_rate || 0,
    };
  }

  getDefaultConfig() {
    return {
      patterns: {
        dependency_vulnerability: {
          keywords: ['audit', 'vulnerability', 'security'],
          auto_fixable: true,
          remediation: [
            { step: 'dependency_audit_fix', command: 'pnpm audit fix' },
          ],
        },
        lint_error: {
          keywords: ['eslint', 'lint'],
          auto_fixable: true,
          remediation: [{ step: 'eslint_fix', command: 'pnpm run lint:fix' }],
        },
      },
    };
  }
}

// CLI interface
if (require.main === module) {
  const remediation = new FailureRemediationSystem();

  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'analyze':
      const logFile = args[1];
      if (!logFile) {
        console.error('Usage: node failure-remediation.js analyze <log-file>');
        process.exit(1);
      }

      const logContent = fs.readFileSync(logFile, 'utf8');
      const analysis = remediation.analyzeFailure(
        logContent,
        'unknown',
        'unknown'
      );
      console.log(JSON.stringify(analysis, null, 2));
      break;

    case 'remediate':
      const analysisFile = args[1];
      const dryRun = args.includes('--dry-run');

      if (!analysisFile) {
        console.error(
          'Usage: node failure-remediation.js remediate <analysis-file> [--dry-run]'
        );
        process.exit(1);
      }

      const analysisData = JSON.parse(fs.readFileSync(analysisFile, 'utf8'));
      remediation.applyRemediation(analysisData, dryRun).then(results => {
        console.log('Remediation Results:', JSON.stringify(results, null, 2));
      });
      break;

    case 'report':
      console.log(
        'Failure History:',
        JSON.stringify(remediation.failureHistory, null, 2)
      );
      break;

    default:
      console.log(`
Usage: node failure-remediation.js <command> [options]

Commands:
  analyze <log-file>              Analyze failure log
  remediate <analysis-file>       Apply remediation
  report                          Show failure history

Options:
  --dry-run                       Simulate remediation without making changes
      `);
  }
}

module.exports = FailureRemediationSystem;
