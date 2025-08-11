#!/usr/bin/env node

/**
 * Production Database Connectivity Test
 * 
 * This script tests the production Supabase database connectivity
 * using the environment variables from .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local manually
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '../.env.local');
    const envContent = readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...values] = trimmedLine.split('=');
        if (key && values.length > 0) {
          process.env[key] = values.join('=').replace(/^["']|["']$/g, '');
        }
      }
    });
  } catch (error) {
    console.error('Could not load .env.local file:', error.message);
  }
}

loadEnvFile();

// Use production environment variables
const supabaseUrl = process.env.BNSL_NEXT_PUBLIC_SUPABASE_URL || process.env.BNSL_SUPABASE_URL;
const supabaseAnonKey = process.env.BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.BNSL_SUPABASE_SERVICE_ROLE_KEY;

console.log('\n🔍 Testing Production Supabase Database Connectivity...\n');

// Validation
if (!supabaseUrl || !supabaseUrl.includes('.supabase.co')) {
  console.error('❌ Invalid or missing SUPABASE_URL');
  console.log(`   Found: ${supabaseUrl}`);
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('❌ Missing SUPABASE_ANON_KEY');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log(`✅ Environment Variables Validated`);
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Anon Key: ${supabaseAnonKey.substring(0, 20)}...`);
console.log(`   Service Key: ${supabaseServiceKey.substring(0, 20)}...\n`);

// Create clients
const publicClient = createClient(supabaseUrl, supabaseAnonKey);
const adminClient = createClient(supabaseUrl, supabaseServiceKey);

async function runTests() {
  let passed = 0;
  let failed = 0;
  
  // Test 1: Public client - testimonials query
  console.log('🔍 Test 1: Public client testimonials query...');
  try {
    const startTime = Date.now();
    const { data, error } = await publicClient
      .from('testimonials')
      .select('id, name, active, featured')
      .eq('active', true)
      .limit(3);
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      console.error(`❌ Test 1 Failed: ${error.message}`);
      failed++;
    } else {
      console.log(`✅ Test 1 Passed: Retrieved ${data?.length || 0} testimonials (${responseTime}ms)`);
      if (data && data.length > 0) {
        console.log(`   Sample: ${data[0].name}`);
      }
      passed++;
    }
  } catch (err) {
    console.error(`❌ Test 1 Error: ${err.message}`);
    failed++;
  }
  
  console.log('');
  
  // Test 2: Admin client - users query
  console.log('🔍 Test 2: Admin client users query...');
  try {
    const startTime = Date.now();
    const { data, error } = await adminClient
      .from('users')
      .select('id, email, role')
      .limit(3);
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      console.error(`❌ Test 2 Failed: ${error.message}`);
      failed++;
    } else {
      console.log(`✅ Test 2 Passed: Retrieved ${data?.length || 0} users (${responseTime}ms)`);
      if (data && data.length > 0) {
        console.log(`   Sample roles: ${data.map(u => u.role).join(', ')}`);
      }
      passed++;
    }
  } catch (err) {
    console.error(`❌ Test 2 Error: ${err.message}`);
    failed++;
  }
  
  console.log('');
  
  // Test 3: Admin client - claims query with enums
  console.log('🔍 Test 3: Admin client claims query (testing enums)...');
  try {
    const startTime = Date.now();
    const { data, error } = await adminClient
      .from('claims')
      .select('id, title, status, claim_type, priority')
      .limit(3);
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      console.error(`❌ Test 3 Failed: ${error.message}`);
      failed++;
    } else {
      console.log(`✅ Test 3 Passed: Retrieved ${data?.length || 0} claims (${responseTime}ms)`);
      if (data && data.length > 0) {
        const claim = data[0];
        console.log(`   Sample: "${claim.title}" - ${claim.status} (${claim.claim_type})`);
      }
      passed++;
    }
  } catch (err) {
    console.error(`❌ Test 3 Error: ${err.message}`);
    failed++;
  }
  
  console.log('');
  
  // Test 4: Activity log query
  console.log('🔍 Test 4: Admin client activity log query...');
  try {
    const startTime = Date.now();
    const { data, error } = await adminClient
      .from('activity_log')
      .select('id, activity_type, entity_type, created_at')
      .limit(3);
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      console.error(`❌ Test 4 Failed: ${error.message}`);
      failed++;
    } else {
      console.log(`✅ Test 4 Passed: Retrieved ${data?.length || 0} activity logs (${responseTime}ms)`);
      passed++;
    }
  } catch (err) {
    console.error(`❌ Test 4 Error: ${err.message}`);
    failed++;
  }
  
  console.log('');
  
  // Test 5: Function call (get_user_by_email)
  console.log('🔍 Test 5: Database function call...');
  try {
    const startTime = Date.now();
    const { data, error } = await adminClient
      .rpc('get_user_by_email', { email_address: 'admin@example.com' });
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      console.error(`❌ Test 5 Failed: ${error.message}`);
      failed++;
    } else {
      console.log(`✅ Test 5 Passed: Function executed successfully (${responseTime}ms)`);
      console.log(`   Result: ${data ? JSON.stringify(data, null, 2) : 'null'}`);
      passed++;
    }
  } catch (err) {
    console.error(`❌ Test 5 Error: ${err.message}`);
    failed++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Database is healthy.');
    return true;
  } else {
    console.log(`\n⚠️  ${failed} tests failed. Please check the database connection.`);
    return false;
  }
}

// Health check function
export async function supabaseHealthCheck() {
  try {
    const startTime = Date.now();
    const { data, error } = await publicClient
      .from('testimonials')
      .select('id')
      .limit(1);
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      return {
        status: 'unhealthy',
        message: `Database connection failed: ${error.message}`,
        details: { error, responseTime }
      };
    }
    
    return {
      status: 'healthy',
      message: 'Database connection successful',
      details: { responseTime, url: supabaseUrl }
    };
  } catch (error) {
    return {
      status: 'unhealthy', 
      message: `Health check failed: ${error.message}`,
      details: { error }
    };
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}
