import postgres from "postgres";

const sql = postgres("postgres://malaylang:malaylang@localhost:5432/malaylang");
const lessons = await sql`SELECT slug, title, "order" FROM lessons ORDER BY "order"`;
console.log("Lessons:", lessons.length);
for (const l of lessons) {
  console.log(`  - ${l.slug}: ${l.title}`);
}
const vocab = await sql`SELECT COUNT(*)::int as cnt FROM vocabulary`;
console.log("Vocabulary count:", vocab[0].cnt);
const vocabSample = await sql`SELECT malay, english FROM vocabulary LIMIT 5`;
console.log("Sample words:", vocabSample.map(v => `${v.malay}=${v.english}`).join(", "));
await sql.end();
