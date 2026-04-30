import { sql } from '../lib/db.ts'
import { initializeDatabase } from '../lib/db.ts'

async function seedDashboardData() {
  console.log('Starting database seed...')

  try {
    await initializeDatabase()
    console.log('Database tables created')

    const now = new Date()

    console.log('Seeding users...')
    const testUsers = [
      { githubId: 1001, username: 'alice_dev', email: 'alice@example.com', plan: 'pro' },
      { githubId: 1002, username: 'bob_coder', email: 'bob@example.com', plan: 'starter' },
      { githubId: 1003, username: 'charlie_ops', email: 'charlie@example.com', plan: 'enterprise' },
      { githubId: 1004, username: 'dana_fe', email: 'dana@example.com', plan: 'free' },
      { githubId: 1005, username: 'eve_backend', email: 'eve@example.com', plan: 'pro' },
    ]

    for (const user of testUsers) {
      try {
        await sql`
          INSERT INTO users (id, github_id, username, email, plan, created_at)
          VALUES (
            ${`user_${user.githubId}`},
            ${user.githubId},
            ${user.username},
            ${user.email},
            ${user.plan},
            ${new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000)}
          )
          ON CONFLICT (github_id) DO NOTHING
        `
      } catch (e) {
        console.error(`Failed to seed user ${user.username}:`, e)
      }
    }

    console.log('Seeding affiliate users...')
    const affiliates = [
      { githubId: 2001, username: 'developer_x', code: 'DEVVY', paidCount: 5 },
      { githubId: 2002, username: 'tech_reviewer', code: 'TECH22', paidCount: 3 },
      { githubId: 2003, username: 'startup_founder', code: 'STARTUP', paidCount: 8 },
      { githubId: 2004, username: 'devtools_daily', code: 'DTOOLS', paidCount: 2 },
      { githubId: 2005, username: 'code_guru', code: 'CODE123', paidCount: 4 },
    ]

    for (const aff of affiliates) {
      try {
        await sql`
          INSERT INTO affiliate_users (id, github_id, username, affiliate_code, referral_count, paid_referral_count, tier, created_at)
          VALUES (
            ${`aff_${aff.githubId}`},
            ${aff.githubId},
            ${aff.username},
            ${aff.code},
            ${aff.paidCount * 3},
            ${aff.paidCount},
            ${aff.paidCount >= 5 ? 'advanced' : aff.paidCount >= 2 ? 'basic' : 'free'},
            ${new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000)}
          )
          ON CONFLICT (github_id) DO NOTHING
        `
      } catch (e) {
        console.error(`Failed to seed affiliate ${aff.username}:`, e)
      }
    }

    console.log('Seeding affiliate events (clicks, conversions, commissions)...')
    for (let i = 60; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      for (const aff of affiliates) {
        const clicks = Math.floor(20 + Math.random() * 80)
        const conversions = Math.floor(clicks * (0.03 + Math.random() * 0.08))
        const paidConversions = Math.min(conversions, aff.paidCount)

        for (let c = 0; c < clicks; c++) {
          const clickDate = new Date(date)
          clickDate.setHours(Math.floor(Math.random() * 24))
          clickDate.setMinutes(Math.floor(Math.random() * 60))

          try {
            await sql`
              INSERT INTO affiliate_events (event_type, affiliate_id, affiliate_code, commission_amount, conversion_status, metadata, created_at)
              VALUES (
                'click',
                ${`aff_${aff.githubId}`},
                ${aff.code},
                0,
                'pending',
                ${JSON.stringify({ browser: 'chrome', source: 'direct' })},
                ${clickDate}
              )
            `
          } catch (e) {
          }
        }

        for (let conv = 0; conv < conversions; conv++) {
          const convDate = new Date(date)
          convDate.setHours(Math.floor(Math.random() * 24))

          try {
            await sql`
              INSERT INTO affiliate_events (event_type, affiliate_id, affiliate_code, commission_amount, conversion_status, metadata, created_at)
              VALUES (
                'conversion',
                ${`aff_${aff.githubId}`},
                ${aff.code},
                0,
                ${conv < paidConversions ? 'completed' : 'pending'},
                ${JSON.stringify({ referredUser: `user_${aff.githubId}_${conv}` })},
                ${convDate}
              )
            `
          } catch (e) {
          }

          if (conv < paidConversions) {
            const commissionAmount = 299 * 0.15

            try {
              await sql`
                INSERT INTO affiliate_events (event_type, affiliate_id, affiliate_code, commission_amount, conversion_status, metadata, created_at)
                VALUES (
                  'commission_paid',
                  ${`aff_${aff.githubId}`},
                  ${aff.code},
                  ${commissionAmount},
                  'paid',
                  ${JSON.stringify({ referredUser: `user_${aff.githubId}_${conv}`, amount: 299 })},
                  ${convDate}
                )
              `
            } catch (e) {
            }
          }
        }
      }
    }

    console.log('Seeding revenue events...')
    const plans = [
      { plan: 'starter', amount: 299 },
      { plan: 'pro', amount: 500 },
    ]

    for (let i = 60; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      const numPurchases = Math.floor(Math.random() * 5) + 1
      for (let p = 0; p < numPurchases; p++) {
        const purchaseDate = new Date(date)
        purchaseDate.setHours(Math.floor(Math.random() * 24))
        purchaseDate.setMinutes(Math.floor(Math.random() * 60))

        const planInfo = plans[Math.floor(Math.random() * plans.length)]

        try {
          await sql`
            INSERT INTO revenue_events (event_type, amount, customer_id, subscription_tier, metadata, created_at)
            VALUES (
              ${Math.random() > 0.3 ? 'subscription' : 'purchase'},
              ${planInfo.amount * 100},
              ${`cust_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`},
              ${planInfo.plan},
              ${JSON.stringify({ source: 'seed' })},
              ${purchaseDate}
            )
          `
        } catch (e) {
        }
      }
    }

    console.log('Seeding user events (page views)...')
    const pages = ['/', '/pricing', '/features', '/docs', '/blog']
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      for (let h = 0; h < 24; h++) {
        const pageViews = Math.floor(50 + Math.random() * 200)
        for (let p = 0; p < pageViews; p++) {
          const eventDate = new Date(date)
          eventDate.setHours(h)
          eventDate.setMinutes(Math.floor(Math.random() * 60))

          try {
            await sql`
              INSERT INTO user_events (event_type, user_id, session_id, page_url, user_agent, ip_hash, metadata, created_at)
              VALUES (
                'page_view',
                null,
                ${`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`},
                ${pages[Math.floor(Math.random() * pages.length)]},
                'Mozilla/5.0',
                ${Math.abs(Math.floor(Math.random() * 0xFFFFFFFF)).toString(16)},
                ${JSON.stringify({})},
                ${eventDate}
              )
            `
          } catch (e) {
          }
        }
      }
    }

    console.log('Seed completed successfully!')
    console.log('')
    console.log('Summary:')
    console.log('- Users table: 5 test users')
    console.log('- Affiliate users table: 5 affiliates')
    console.log('- Affiliate events table: clicks, conversions, commissions')
    console.log('- Revenue events table: subscriptions and purchases')
    console.log('- User events table: page views')
  } catch (error) {
    console.error('Seed failed:', error)
    throw error
  } finally {
    process.exit(0)
  }
}

seedDashboardData()