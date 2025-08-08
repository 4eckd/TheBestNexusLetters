import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🎭 Starting E2E test global teardown...');

  // Clean up test database or other global resources
  if (process.env.CI) {
    console.log('CI environment detected, cleaning up test environment...');
    // In CI, you might clean up test database, etc.
  }

  // Additional cleanup tasks
  try {
    // Clean up any test files, reset states, etc.
    console.log('🧹 Cleaning up test artifacts...');
    
    // Example: Clean up uploaded files, reset test data, etc.
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    // Don't throw - we don't want to fail the test run due to cleanup issues
  }

  console.log('✅ Global teardown completed');
}

export default globalTeardown;
