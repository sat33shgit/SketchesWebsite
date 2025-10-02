import { sql } from '@vercel/postgres';
import 'dotenv/config';

const newValue = process.argv[2];

if (!newValue || !['Y', 'N'].includes(newValue.toUpperCase())) {
  console.error('Usage: node update-message-config.js [Y|N]');
  console.error('  Y = disable messages');
  console.error('  N = enable messages');
  process.exit(1);
}

async function updateConfig() {
  try {
    const value = newValue.toUpperCase();
    console.log(`Updating message_disable configuration to: ${value}`);
    
    await sql`
      UPDATE configurations 
      SET value = ${value}, date_updated = NOW() 
      WHERE key = 'message_disable'
    `;
    
    console.log('✅ Configuration updated successfully!');
    
    // Verify the update
    const result = await sql`
      SELECT key, value, date_updated 
      FROM configurations 
      WHERE key = 'message_disable'
    `;
    
    if (result.rows.length > 0) {
      console.log('✅ Current configuration:', result.rows[0]);
    }
    
    console.log(`\nMessages are now: ${value === 'Y' ? 'DISABLED' : 'ENABLED'}`);
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

updateConfig();
