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
        github_installation_id BIGINT,
        installation_status VARCHAR(20) DEFAULT 'disconnected',
        razorpay_subscription_id VARCHAR(50),
        plan_started_at TIMESTAMP,
        plan_expires_at TIMESTAMP,
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
        accumulated_credit INTEGER DEFAULT 0, -- Store in cents/paise
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
        purchased_plan VARCHAR(20),
        purchased_amount INTEGER,
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
        affiliate_code VARCHAR(50),
        referrer_id VARCHAR(100),
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
        currency VARCHAR(10) NOT NULL DEFAULT 'INR',
        github_id BIGINT,
        customer_id VARCHAR(100),
        subscription_tier VARCHAR(50),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS razorpay_plans (
        id SERIAL PRIMARY KEY,
        plan_key VARCHAR(50) UNIQUE NOT NULL,
        razorpay_plan_id VARCHAR(50) NOT NULL,
        amount INTEGER NOT NULL,
        currency VARCHAR(10) NOT NULL,
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

    // Add github_installation_id column if it doesn't exist
    try {
      const hasInstallationId = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'github_installation_id'
      `
      if (hasInstallationId.length === 0) {
        await sql`
          ALTER TABLE users ADD COLUMN github_installation_id BIGINT
        `
        console.log('Added github_installation_id column to users table')
      }
    } catch (e) {
      console.log('Migration info: github_installation_id column may already exist', e)
    }

    // Add installation_status column if it doesn't exist
    try {
      const hasInstallationStatus = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'installation_status'
      `
      if (hasInstallationStatus.length === 0) {
        await sql`
          ALTER TABLE users ADD COLUMN installation_status VARCHAR(20) DEFAULT 'disconnected'
        `
        console.log('Added installation_status column to users table')
      }
    } catch (e) {
      console.log('Migration info: installation_status column may already exist', e)
    }

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

    await sql`
      CREATE INDEX IF NOT EXISTS idx_daily_aggregates_date_cat ON daily_aggregates(date, metric_category)
    `

    // Migrate all github_id columns to BIGINT if they were previously INTEGER
    const tablesToMigrate = [
      { table: 'users', col: 'github_id' },
      { table: 'affiliate_users', col: 'github_id' },
      { table: 'referrals', col: 'referred_github_id' },
      { table: 'revenue_events', col: 'github_id' }
    ]

    for (const item of tablesToMigrate) {
      try {
        await sql.unsafe(`ALTER TABLE ${item.table} ALTER COLUMN ${item.col} TYPE BIGINT`)
        console.log(`Migrated ${item.table}.${item.col} to BIGINT`)
      } catch (e) {
        // Ignore if already BIGINT or table doesn't exist yet
      }
    }

    // Add subscription columns if they don't exist
    for (const colDef of [
      { name: 'razorpay_subscription_id', ddl: 'ALTER TABLE users ADD COLUMN razorpay_subscription_id VARCHAR(50)' },
      { name: 'plan_started_at', ddl: 'ALTER TABLE users ADD COLUMN plan_started_at TIMESTAMP' },
      { name: 'plan_expires_at', ddl: 'ALTER TABLE users ADD COLUMN plan_expires_at TIMESTAMP' },
    ]) {
      try {
        const hasCol = await sql`
          SELECT column_name FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = ${colDef.name}
        `
        if (hasCol.length === 0) {
          await sql.unsafe(colDef.ddl)
          console.log(`Added ${colDef.name} column to users table`)
        }
      } catch (e) {
        console.log(`Migration info: ${colDef.name} column may already exist`, e)
      }
    }

    // Migrate existing paid users: give them 30 days from now
    try {
      await sql`
        UPDATE users
        SET plan_expires_at = NOW() + INTERVAL '30 days',
            plan_started_at = NOW()
        WHERE plan IN ('starter', 'pro')
          AND plan_expires_at IS NULL
      `
      console.log('Migrated existing paid users with 30-day grace period')
    } catch (e) {
      console.log('Migration info: paid user migration may have already run', e)
    }

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
  } catch (error: any) {
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
  } catch (error: any) {
    if (error.code !== '42P07') {
      console.error('Failed to add FK constraint:', error)
    }
  }
}