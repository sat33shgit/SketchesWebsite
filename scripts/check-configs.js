import { sql } from '@vercel/postgres';
import 'dotenv/config';

async function checkConfigs() {
  try {
    console.log('Checking all configurations...\n');
    
    const result = await sql`SELECT key, value, date_created, date_updated FROM configurations ORDER BY key`;
    
    console.log('Current configurations:');
    console.table(result.rows);
    
  } catch (error) {
    console.error('❌ Failed to check configurations:', error);
    process.exit(1);
  }
}

checkConfigs();
