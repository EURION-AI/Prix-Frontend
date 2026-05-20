const postgres = require('postgres');
const dotenv = require('dotenv');

dotenv.config();

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
});

async function deleteUser(userId) {
  try {
    console.log(`Attempting to delete user: ${userId}`);

    // 1. Get the github_id first
    const users = await sql`SELECT github_id FROM users WHERE id = ${userId}`;
    
    if (users.length === 0) {
      console.log('User not found.');
      return;
    }

    const githubId = users[0].github_id;
    console.log(`Found user with github_id: ${githubId}`);

    // 2. Delete the user
    // Due to ON DELETE CASCADE on affiliate_users, that will be handled.
    // Due to ON DELETE SET NULL on referrals/affiliate_events, those will be handled.
    
    const result = await sql`DELETE FROM users WHERE id = ${userId} RETURNING *`;
    
    if (result.length > 0) {
      console.log('Successfully deleted user and cascaded related data.');
    } else {
      console.log('Delete failed for unknown reason.');
    }

  } catch (error) {
    console.error('Error deleting user:', error);
    if (error.code === '23503') {
      console.error('FOREIGN KEY CONSTRAINT VIOLATION: There is data in another table pointing to this user that does not have ON DELETE CASCADE.');
    }
  } finally {
    await sql.end();
  }
}

const targetUser = 'user_1778007926047_280411755_df6fc454';
deleteUser(targetUser);
