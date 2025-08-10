#!/usr/bin/env node

/**
 * Comprehensive cleanup script for build directories and cache files
 * Supports Windows, macOS, and Linux
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Directories and files to clean
const CLEANUP_TARGETS = {
  // Build directories
  buildDirs: [
    '.next',
    'build',
    'dist',
    'out',
    'site', // MkDocs build
    'storybook-static',
    '.storybook/dist',
    '.vercel',
    '.netlify',
  ],

  // Cache directories
  cacheDirs: [
    'node_modules/.cache',
    '.cache',
    '.turbo',
    '.swc',
    '.next/cache',
    'coverage',
    '.nyc_output',
    '.vitest',
    'test-results',
    'playwright-report',
    'playwright-results',
    'playwright/.cache',
  ],

  // Temporary files and directories
  tempDirs: [
    'tmp',
    'temp',
    '.tmp',
    '.temp',
    'logs',
    '*.log',
    '.DS_Store',
    'Thumbs.db',
    'desktop.ini',
  ],

  // Package manager artifacts
  packageDirs: [
    'node_modules',
    '.pnpm-store',
    '.yarn/cache',
    '.yarn/unplugged',
    '.yarn/build-state.yml',
    '.yarn/install-state.gz',
    'pnpm-lock.yaml.bak',
    'yarn-error.log',
    'npm-debug.log*',
    'yarn-debug.log*',
  ],

  // Development artifacts
  devDirs: [
    '.env.local.bak',
    '.env.*.bak',
    '**/*.tsbuildinfo',
    'tsconfig.tsbuildinfo',
    '.eslintcache',
    '.stylelintcache',
    '.prettiercache',
  ],

  // Test artifacts
  testDirs: [
    'coverage',
    'test-results',
    'playwright-report',
    'playwright-results',
    'allure-results',
    'allure-report',
    'mochawesome-report',
    'jest-coverage',
    '.vitest/coverage',
  ],
};

class CleanupManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.deletedCount = 0;
    this.totalSize = 0;
    this.errors = [];
    this.verbose =
      process.argv.includes('--verbose') || process.argv.includes('-v');
    this.dryRun =
      process.argv.includes('--dry-run') || process.argv.includes('-d');
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logVerbose(message, color = 'dim') {
    if (this.verbose) {
      this.log(`  ${message}`, color);
    }
  }

  async getDirectorySize(dirPath) {
    try {
      if (process.platform === 'win32') {
        // Use PowerShell on Windows for better performance
        const result = execSync(
          `powershell -Command "(Get-ChildItem -Path '${dirPath}' -Recurse -Force | Measure-Object -Property Length -Sum).Sum"`,
          {
            encoding: 'utf8',
            stdio: 'pipe',
          }
        );
        return parseInt(result.trim()) || 0;
      } else {
        // Use du on Unix-like systems
        const result = execSync(`du -sb "${dirPath}" 2>/dev/null | cut -f1`, {
          encoding: 'utf8',
          stdio: 'pipe',
        });
        return parseInt(result.trim()) || 0;
      }
    } catch (error) {
      return 0;
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async removeDirectory(dirPath) {
    const fullPath = path.resolve(this.projectRoot, dirPath);

    if (!fs.existsSync(fullPath)) {
      this.logVerbose(`Skip: ${dirPath} (not found)`, 'dim');
      return false;
    }

    const stats = await fs.promises.stat(fullPath);
    if (!stats.isDirectory()) {
      this.logVerbose(`Skip: ${dirPath} (not a directory)`, 'dim');
      return false;
    }

    // Calculate size before deletion
    const size = await this.getDirectorySize(fullPath);

    if (this.dryRun) {
      this.log(
        `[DRY RUN] Would delete: ${dirPath} (${this.formatBytes(size)})`,
        'yellow'
      );
      this.totalSize += size;
      this.deletedCount++;
      return true;
    }

    try {
      await fs.promises.rm(fullPath, { recursive: true, force: true });
      this.log(`Deleted: ${dirPath} (${this.formatBytes(size)})`, 'green');
      this.totalSize += size;
      this.deletedCount++;
      return true;
    } catch (error) {
      this.errors.push({ path: dirPath, error: error.message });
      this.log(`Error deleting ${dirPath}: ${error.message}`, 'red');
      return false;
    }
  }

  async removeGlobPattern(pattern) {
    const glob = require('glob');
    const matches = glob.sync(pattern, { cwd: this.projectRoot, dot: true });

    for (const match of matches) {
      const fullPath = path.resolve(this.projectRoot, match);

      try {
        const stats = await fs.promises.stat(fullPath);
        const size = stats.isDirectory()
          ? await this.getDirectorySize(fullPath)
          : stats.size;

        if (this.dryRun) {
          this.log(
            `[DRY RUN] Would delete: ${match} (${this.formatBytes(size)})`,
            'yellow'
          );
          this.totalSize += size;
          this.deletedCount++;
          continue;
        }

        if (stats.isDirectory()) {
          await fs.promises.rm(fullPath, { recursive: true, force: true });
        } else {
          await fs.promises.unlink(fullPath);
        }

        this.log(`Deleted: ${match} (${this.formatBytes(size)})`, 'green');
        this.totalSize += size;
        this.deletedCount++;
      } catch (error) {
        this.errors.push({ path: match, error: error.message });
        this.log(`Error deleting ${match}: ${error.message}`, 'red');
      }
    }
  }

  async cleanCategory(categoryName, paths) {
    this.log(`\n🧹 Cleaning ${categoryName}...`, 'cyan');

    for (const targetPath of paths) {
      if (targetPath.includes('*')) {
        await this.removeGlobPattern(targetPath);
      } else {
        await this.removeDirectory(targetPath);
      }
    }
  }

  async cleanAll() {
    this.log(`\n${colors.bright}🚀 Starting cleanup...${colors.reset}`, 'blue');
    if (this.dryRun) {
      this.log(
        'Running in DRY RUN mode - no files will actually be deleted\n',
        'yellow'
      );
    }

    // Clean all categories
    await this.cleanCategory('Build directories', CLEANUP_TARGETS.buildDirs);
    await this.cleanCategory('Cache directories', CLEANUP_TARGETS.cacheDirs);
    await this.cleanCategory('Temporary files', CLEANUP_TARGETS.tempDirs);
    await this.cleanCategory('Development artifacts', CLEANUP_TARGETS.devDirs);
    await this.cleanCategory('Test artifacts', CLEANUP_TARGETS.testDirs);

    // Optional: Clean package directories (requires confirmation)
    if (
      process.argv.includes('--deep') ||
      process.argv.includes('--packages')
    ) {
      this.log('\n⚠️  Deep cleaning package directories...', 'yellow');
      await this.cleanCategory(
        'Package directories',
        CLEANUP_TARGETS.packageDirs
      );
    }
  }

  showSummary() {
    this.log(`\n${colors.bright}📊 Cleanup Summary${colors.reset}`, 'blue');
    this.log(`Files/directories processed: ${this.deletedCount}`, 'green');
    this.log(
      `Total space ${this.dryRun ? 'that would be ' : ''}freed: ${this.formatBytes(this.totalSize)}`,
      'green'
    );

    if (this.errors.length > 0) {
      this.log(`\n❌ Errors encountered: ${this.errors.length}`, 'red');
      if (this.verbose) {
        this.errors.forEach(({ path, error }) => {
          this.log(`  ${path}: ${error}`, 'red');
        });
      }
    }

    if (!this.dryRun && this.deletedCount === 0) {
      this.log(
        '\n✨ Nothing to clean - your project is already tidy!',
        'green'
      );
    } else if (this.dryRun) {
      this.log(
        '\n🔍 Run without --dry-run to actually delete these files',
        'yellow'
      );
    } else {
      this.log('\n✅ Cleanup completed successfully!', 'green');
    }
  }

  showHelp() {
    this.log(
      `
${colors.bright}🧹 Project Cleanup Script${colors.reset}

${colors.bright}Usage:${colors.reset}
  node scripts/clean.js [options]

${colors.bright}Options:${colors.reset}
  -v, --verbose     Show detailed output
  -d, --dry-run     Show what would be deleted without actually deleting
  --deep            Clean package directories (node_modules, etc.)
  --packages        Alias for --deep
  --help            Show this help message

${colors.bright}Examples:${colors.reset}
  node scripts/clean.js                 # Clean build and cache directories
  node scripts/clean.js --dry-run       # Preview what would be cleaned
  node scripts/clean.js --verbose       # Detailed cleanup output
  node scripts/clean.js --deep          # Deep clean including node_modules
  node scripts/clean.js -v -d           # Verbose dry run

${colors.bright}Categories cleaned:${colors.reset}
  • Build directories (.next, dist, out, etc.)
  • Cache directories (node_modules/.cache, .turbo, etc.)
  • Temporary files (logs, .DS_Store, etc.)
  • Development artifacts (.eslintcache, *.tsbuildinfo, etc.)
  • Test artifacts (coverage, test-results, etc.)
  • Package directories (--deep flag required)
`,
      'cyan'
    );
  }
}

// Main execution
async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    const cleanup = new CleanupManager();
    cleanup.showHelp();
    return;
  }

  const cleanup = new CleanupManager();

  try {
    await cleanup.cleanAll();
    cleanup.showSummary();
  } catch (error) {
    console.error(
      `${colors.red}Fatal error during cleanup: ${error.message}${colors.reset}`
    );
    process.exit(1);
  }
}

// Check if glob is available
let glob;
try {
  glob = require('glob');
} catch (error) {
  console.log('Installing required dependency: glob...');
  try {
    execSync('pnpm add --save-dev glob', { stdio: 'inherit' });
    glob = require('glob');
  } catch (installError) {
    console.error(
      'Failed to install glob dependency. Please run: pnpm add --save-dev glob'
    );
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(
      `${colors.red}Unhandled error: ${error.message}${colors.reset}`
    );
    process.exit(1);
  });
}

module.exports = { CleanupManager, CLEANUP_TARGETS };
