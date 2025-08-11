#!/usr/bin/env node

/**
 * Quick Supabase Health Check
 * Simple connectivity test without complex dependencies
 */

const { readFileSync } = require('fs');
const path = require('path');

// Load environment variables manually
function loadEnv() {
  try {
    const envContent = readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key && values.length > 0) {
          env[key] = values.join('=').replace(/^["']|["']$/g, '');
        }
      }
    });
    
    return env;
  } catch (error) {
    console.error('Could not load .env.local:', error.message);
    return {};
  }
}

async function quickHealthCheck() {
  const env = loadEnv();
  
  const supabaseUrl = env.BNSL_NEXT_PUBLIC_SUPABASE_URL || env.BNSL_SUPABASE_URL;
  const anonKey = env.BNSL_NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('\n🔍 Quick Supabase Health Check');
  console.log('================================');
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Key: ${anonKey ? anonKey.substring(0, 20) + '...' : 'MISSING'}`);
  
  if (!supabaseUrl || !supabaseUrl.includes('.supabase.co')) {
    console.log('❌ Invalid Supabase URL');
    return false;
  }
  
  if (!anonKey) {
    console.log('❌ Missing anon key');
    return false;
  }
  
  // Simple HTTP check to testimonials endpoint
  const testUrl = `${supabaseUrl}/rest/v1/testimonials?select=id&active=eq.true&limit=1`;
  
  try {
    console.log('\n🔍 Testing HTTP connection...');
    
    // Use built-in fetch in Node.js 18+
    let fetchFunc;
    try {
      fetchFunc = globalThis.fetch;
    } catch (e) {
      // Fallback for older Node versions
      const { default: nodeFetch } = await import('node-fetch');
      fetchFunc = nodeFetch;
    }
    
    const response = await fetchFunc(testUrl, {
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Success: Retrieved ${data?.length || 0} records`);
      console.log('🎉 Database is healthy!');
      return true;
    } else {
      const error = await response.text();
      console.log(`❌ Error: ${error}`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  quickHealthCheck()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { quickHealthCheck };
