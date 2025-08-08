#!/usr/bin/env node

/**
 * Database Setup Script
 * Initializes Supabase database with schema and seed data
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SUPABASE_SQL_DIR = path.join(__dirname, '..', 'supabase', 'sql');
const MIGRATION_FILES = [
  '001_initial_schema.sql',
  '002_seed_data.sql'
];

console.log('🚀 Setting up Supabase database...\n');

// Check if Supabase CLI is available
try {
  execSync('supabase --version', { stdio: 'ignore' });
  console.log('✅ Supabase CLI is available');
} catch (error) {
  console.error('❌ Supabase CLI not found. Please install it first:');
  console.error('npm install -g supabase');
  process.exit(1);
}

// Check if supabase project is initialized
if (!fs.existsSync(path.join(__dirname, '..', 'supabase', 'config.toml'))) {
  console.error('❌ Supabase project not initialized. Run: supabase init');
  process.exit(1);
}

// Function to run SQL file
function runSQLFile(fileName) {
  const filePath = path.join(SUPABASE_SQL_DIR, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ SQL file not found: ${fileName}`);
    process.exit(1);
  }

  console.log(`📄 Executing ${fileName}...`);
  
  try {
    // Read and execute the SQL file
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    // For now, we'll copy to migrations directory for Supabase to handle
    const migrationDir = path.join(__dirname, '..', 'supabase', 'migrations');
    if (!fs.existsSync(migrationDir)) {
      fs.mkdirSync(migrationDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, -4);
    const migrationFileName = `${timestamp}_${fileName}`;
    const migrationPath = path.join(migrationDir, migrationFileName);
    
    fs.writeFileSync(migrationPath, sqlContent);
    console.log(`✅ Created migration: ${migrationFileName}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error.message);
    process.exit(1);
  }
}

// Main setup process
async function setupDatabase() {
  console.log('🔄 Starting Supabase local development...');
  
  try {
    // Start Supabase locally
    console.log('Starting Supabase services...');
    execSync('supabase start', { stdio: 'inherit' });
    console.log('✅ Supabase services started');
    
    // Process SQL files
    console.log('\n📊 Setting up database schema and data...');
    for (const fileName of MIGRATION_FILES) {
      runSQLFile(fileName);
    }
    
    // Apply migrations
    console.log('\n🔄 Applying migrations...');
    execSync('supabase db reset', { stdio: 'inherit' });
    console.log('✅ Migrations applied');
    
    // Generate TypeScript types
    console.log('\n📝 Generating TypeScript types...');
    execSync('supabase gen types typescript --local > src/lib/database.types.ts', { stdio: 'inherit' });
    console.log('✅ TypeScript types generated');
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env.local with the local Supabase credentials');
    console.log('2. Start your Next.js development server: npm run dev');
    console.log('3. Visit http://localhost:54323 for Supabase Studio');
    
    console.log('\n🔗 Local Supabase URLs:');
    console.log('• API URL: http://localhost:54321');
    console.log('• Studio: http://localhost:54323');
    console.log('• Inbucket (Email): http://localhost:54324');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Docker is running');
    console.log('2. Check if ports 54321-54324 are available');
    console.log('3. Try running: supabase stop && supabase start');
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n🛑 Setup interrupted. Cleaning up...');
  try {
    execSync('supabase stop', { stdio: 'ignore' });
  } catch (error) {
    // Ignore cleanup errors
  }
  process.exit(0);
});

// Run the setup
setupDatabase();
