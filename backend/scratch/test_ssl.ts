import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection(name: string, config: any) {
  console.log(`\nTesting connection config: ${name}...`);
  const client = new Client(config);
  try {
    await client.connect();
    console.log(`✅ Success for: ${name}`);
    const res = await client.query('SELECT NOW()');
    console.log(`Result:`, res.rows[0]);
    await client.end();
    return true;
  } catch (err: any) {
    console.error(`❌ Failed for: ${name}`);
    console.error(err.message);
    if (err.cause) {
      console.error('Cause:', err.cause.message);
    }
    try {
      await client.end();
    } catch {}
    return false;
  }
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  console.log('DATABASE_URL:', dbUrl);

  // Test 1: Original with SSL rejectUnauthorized false
  await testConnection('SSL rejectUnauthorized: false', {
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });

  // Test 2: SSL completely disabled/false
  await testConnection('SSL: false', {
    connectionString: dbUrl,
    ssl: false,
    connectionTimeoutMillis: 5000,
  });

  // Test 3: No SSL configuration option at all (depends on connectionString query param)
  await testConnection('No SSL options (default)', {
    connectionString: dbUrl,
    connectionTimeoutMillis: 5000,
  });

  // Test 4: SSL rejectUnauthorized: true (full SSL)
  await testConnection('SSL rejectUnauthorized: true', {
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: true },
    connectionTimeoutMillis: 5000,
  });
}

main();
