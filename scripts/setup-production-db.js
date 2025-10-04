import { sql } from '@vercel/postgres'
import 'dotenv/config'

// Production database setup script
// Run this once after deploying to Vercel to set up your database

async function setupProductionDatabase() {
  try {
    console.log('🚀 Setting up production database...')
    
    // 1. Create configurations table
    console.log('📋 Creating configurations table...')
    await sql`
      CREATE TABLE IF NOT EXISTS configurations (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    // 2. Insert default configurations
    console.log('⚙️ Adding default configurations...')
    await sql`
      INSERT INTO configurations (key, value) 
      VALUES 
        ('message_disable', 'N'),
        ('comments_disable', 'N')
      ON CONFLICT (key) DO NOTHING
    `
    
    // 3. Create analytics tables (if not exists)
    console.log('📊 Creating analytics tables...')
    await sql`
      CREATE TABLE IF NOT EXISTS page_visits (
        id SERIAL PRIMARY KEY,
        page_type VARCHAR(50) NOT NULL,
        page_id VARCHAR(100) NOT NULL,
        visit_count INTEGER DEFAULT 1,
        country VARCHAR(100) DEFAULT 'Unknown',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(page_type, page_id, country)
      )
    `
    
    // 4. Create contact messages table
    console.log('📧 Creating contact messages table...')
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        country VARCHAR(100),
        user_agent TEXT,
        status VARCHAR(20) DEFAULT 'new',
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    // 5. Create sketch reactions table
    console.log('❤️ Creating sketch reactions table...')
    await sql`
      CREATE TABLE IF NOT EXISTS sketch_reactions (
        sketch_id INTEGER NOT NULL,
        smiley_type VARCHAR(20) NOT NULL,
        count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (sketch_id, smiley_type)
      )
    `
    
    // 6. Create sketches table (if you want to store sketch metadata in DB)
    console.log('🎨 Creating sketches table...')
    await sql`
      CREATE TABLE IF NOT EXISTS sketches (
        sketch_id INTEGER PRIMARY KEY,
        sketch_name VARCHAR(255) NOT NULL,
        sketch_description TEXT,
        sketch_completed_date DATE,
        time VARCHAR(50),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    console.log('✅ Production database setup complete!')
    console.log('🎯 Your Vercel deployment is ready to use')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    throw error
  }
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupProductionDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export default setupProductionDatabase