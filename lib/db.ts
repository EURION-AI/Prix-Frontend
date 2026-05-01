import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL!, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  transform: {
    undefined: null,
  },
})

export { sql }

export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        github_id BIGINT UNIQUE NOT NULL,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE,
        avatar_url TEXT,
        plan VARCHAR(20) DEFAULT 'free',
        selected_repos JSONB DEFAULT '[]'::jsonb,
        prs_reviewed INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS affiliate_users (
        id VARCHAR(50) PRIMARY KEY,
        github_id BIGINT UNIQUE NOT NULL,
        username VARCHAR(50) NOT NULL,
        affiliate_code VARCHAR(50) UNIQUE NOT NULL,
        referral_count INTEGER DEFAULT 0,
        paid_referral_count INTEGER DEFAULT 0,
        tier VARCHAR(20) DEFAULT 'free',
        created_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_affiliate_users_github
          FOREIGN KEY (github_id) REFERENCES users(github_id)
          ON DELETE CASCADE
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS referrals (
        id VARCHAR(50) PRIMARY KEY,
        affiliate_id VARCHAR(50) NOT NULL,
        referred_github_id BIGINT,
        referred_username VARCHAR(50) NOT NULL,
        referred_ip_hash VARCHAR(64) NOT NULL,
        has_purchased BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(referred_github_id),
        CONSTRAINT fk_referrals_affiliate
          FOREIGN KEY (affiliate_id) REFERENCES affiliate_users(id)
          ON DELETE SET NULL,
        CONSTRAINT fk_referrals_github
          FOREIGN KEY (referred_github_id) REFERENCES users(github_id)
          ON DELETE SET NULL
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS affiliate_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        affiliate_id VARCHAR(50) NOT NULL,
        affiliate_code VARCHAR(50) NOT NULL,
        commission_amount INTEGER DEFAULT 0,
        conversion_status VARCHAR(50) DEFAULT 'pending',
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS revenue_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        amount INTEGER NOT NULL,
        customer_id VARCHAR(100),
        subscription_tier VARCHAR(50),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS daily_aggregates (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        metric_category VARCHAR(50) NOT NULL,
        metric_name VARCHAR(100) NOT NULL,
        total_value DECIMAL(15, 2) NOT NULL,
        count INTEGER DEFAULT 1,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(date, metric_category, metric_name)
      )
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_affiliate_users_github_id ON affiliate_users(github_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_affiliate_users_code ON affiliate_users(affiliate_code)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id ON referrals(affiliate_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_referrals_ip_hash ON referrals(referred_ip_hash)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_referrals_github_id ON referrals(referred_github_id)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_selected_repos ON users USING gin(selected_repos)
    `

    // Migrate existing selected_repo to selected_repos if empty
    try {
      // Check if selected_repo column still exists before attempting migration
      const hasColumn = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'selected_repo'
      `
      if (hasColumn.length > 0) {
        await sql`
          UPDATE users 
          SET selected_repos = jsonb_build_array(selected_repo) 
          WHERE selected_repo IS NOT NULL AND (selected_repos IS NULL OR jsonb_array_length(selected_repos) = 0)
        `
        console.log('Migrated legacy selected_repo data.')
      }
    } catch (e) {
      console.log('Migration info: Skipping legacy data migration.', e)
    }

    // Migrate github_id to BIGINT if it was previously INTEGER
    await sql`
      ALTER TABLE users ALTER COLUMN github_id TYPE BIGINT
    `
    await sql`
      ALTER TABLE affiliate_users ALTER COLUMN github_id TYPE BIGINT
    `
    await sql`
      ALTER TABLE referrals ALTER COLUMN referred_github_id TYPE BIGINT
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_daily_aggregates_date_cat ON daily_aggregates(date, metric_category)
    `

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}

export async function addForeignKeyConstraints() {
  try {
    const result = await sql`
      SELECT constraint_name FROM information_schema.table_constraints
      WHERE table_name = 'affiliate_users'
      AND constraint_name = 'fk_affiliate_users_github'
    `

    if (result.length === 0) {
      await sql`
        ALTER TABLE affiliate_users
        ADD CONSTRAINT fk_affiliate_users_github
        FOREIGN KEY (github_id) REFERENCES users(github_id)
        ON DELETE CASCADE
      `
      console.log('Added FK: affiliate_users -> users')
    }
  } catch (error) {
    if (error.code !== '42P07') {
      console.error('Failed to add FK constraint:', error)
    }
  }

  try {
    await sql`
      ALTER TABLE affiliate_events
      ADD CONSTRAINT fk_affiliate_events_affiliate
      FOREIGN KEY (affiliate_id) REFERENCES affiliate_users(id)
      ON DELETE SET NULL
    `
    console.log('Added FK: affiliate_events -> affiliate_users')
  } catch (error) {
    if (error.code !== '42P07') {
      console.error('Failed to add FK constraint:', error)
    }
  }
}