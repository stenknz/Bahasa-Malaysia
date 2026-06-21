import postgres from "postgres";

const sql = postgres("postgres://malaylang:malaylang@localhost:5432/malaylang");

async function main() {
  // Get all users
  const users = await sql`SELECT id FROM users`;
  console.log(`Seeding daily activity for ${users.length} users...`);

  // Generate 30 days of sample data for each user
  for (const user of users) {
    // Check if data already exists
    const existing = await sql`SELECT COUNT(*)::int as cnt FROM daily_activity WHERE "userId" = ${user.id}`;
    if (existing[0].cnt > 0) {
      console.log(`  User ${user.id.substring(0,8)}: already has ${existing[0].cnt} records, skipping`);
      continue;
    }

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      
      // Random activity with higher probability on recent days
      const activityProb = Math.min(0.9, 0.3 + (29 - i) * 0.02);
      if (Math.random() > activityProb) continue;

      const xp = Math.floor(Math.random() * 150) + 20;
      const lessons = Math.random() > 0.6 ? 1 : 0;
      const words = Math.floor(Math.random() * 15) + 2;

      await sql`
        INSERT INTO daily_activity ("userId", date, "xpEarned", "lessonsCompleted", "wordsReviewed")
        VALUES (${user.id}, ${dateStr}, ${xp}, ${lessons}, ${words})
      `;
    }
    console.log(`  User ${user.id.substring(0,8)}: seeded`);
  }

  console.log("Done!");
  await sql.end();
}

main().catch(console.error);
