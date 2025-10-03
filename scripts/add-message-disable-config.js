import { sql } from '@vercel/postgres';
import 'dotenv/config';

async function addMessageDisableConfig() {
  try {
    console.log('Adding message_disable configuration...');
    
    // Insert the new configuration
    await sql`
      INSERT INTO configurations (key, value) 
      VALUES ('message_disable', 'N')
      ON CONFLICT (key) DO NOTHING
    `;
    
    console.log('✅ message_disable configuration added successfully!');
    
    // Verify it was added
    const result = await sql`SELECT key, value FROM configurations WHERE key = 'message_disable'`;
    if (result.rows.length > 0) {
      console.log('✅ Confirmed: message_disable configuration exists:', result.rows[0]);
    } else {
      console.log('⚠️  Configuration was already present in the database');
    }
    
  } catch (error) {
    console.error('❌ Failed to add configuration:', error);
    process.exit(1);
  }
}

addMessageDisableConfig();
