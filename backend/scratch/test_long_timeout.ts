import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  console.log('DATABASE_URL:', dbUrl);

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000, // 30 seconds!
  });

  console.log('Attempting connection with 30s timeout...');
  const start = Date.now();
  try {
    await client.connect();
    const duration = (Date.now() - start) / 1000;
    console.log(`✅ Connection succeeded after ${duration} seconds!`);
    const res = await client.query('SELECT NOW()');
    console.log('Current time in database:', res.rows[0]);
  } catch (err: any) {
    const duration = (Date.now() - start) / 1000;
    console.error(`❌ Connection failed after ${duration} seconds.`);
    console.error(err.stack);
  } finally {
    await client.end();
  }
}

main();
