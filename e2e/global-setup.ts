import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🎭 Starting E2E test global setup...');

  // Setup test database or other global resources
  if (process.env.CI) {
    console.log('CI environment detected, setting up test environment...');
    // In CI, you might start a test database, seed data, etc.
  }

  // Warm up the application
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';
    
    // Wait for the application to be ready
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.waitForSelector('body', { state: 'visible' });
    
    console.log('✅ Application is ready for testing');
    
    await browser.close();
  } catch (error) {
    console.error('❌ Failed to warm up application:', error);
    throw error;
  }

  console.log('✅ Global setup completed');
}

export default globalSetup;
