import { sql } from '@vercel/postgres';
import 'dotenv/config';

async function updateCommentConfig(newValue) {
  try {
    if (newValue !== 'Y' && newValue !== 'N') {
      console.error('❌ Invalid value. Use "Y" to disable or "N" to enable comments.');
      process.exit(1);
    }

    console.log(`Updating comments_disable configuration to: ${newValue}`);
    
    // Update the configuration
    await sql`
      UPDATE configurations 
      SET value = ${newValue}, updated_at = NOW() 
      WHERE key = 'comments_disable'
    `;
    
    console.log('✅ Configuration updated successfully!');
    
    // Verify the update
    const result = await sql`SELECT key, value, updated_at FROM configurations WHERE key = 'comments_disable'`;
    if (result.rows.length > 0) {
      console.log('✅ Current configuration:', result.rows[0]);
      console.log(`\nComments are now: ${newValue === 'Y' ? 'DISABLED' : 'ENABLED'}`);
    }
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

// Get value from command line argument
const newValue = process.argv[2];
if (!newValue) {
  console.log('Usage: node scripts/update-comments-config.js <Y|N>');
  console.log('  Y - Disable comments');
  console.log('  N - Enable comments');
  process.exit(1);
}

updateCommentConfig(newValue.toUpperCase());
