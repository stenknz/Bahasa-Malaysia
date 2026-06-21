import postgres from "postgres";

const sql = postgres("postgres://malaylang:malaylang@localhost:5432/malaylang");
const lessons = await sql`SELECT slug, sections FROM lessons ORDER BY "order"`;
for (const l of lessons) {
  console.log(`\n=== ${l.slug} ===`);
  const sections = typeof l.sections === "string" ? JSON.parse(l.sections) : l.sections;
  for (const section of sections) {
    console.log(`  type=${section.type}, content keys: ${Object.keys(section.content).join(", ")}`);
    if (section.type === "vocab") console.log(`    words: ${section.content.words?.length} items`);
    if (section.type === "dialogue") console.log(`    lines: ${section.content.lines?.length} items`);
    if (section.type === "exercise") console.log(`    questions: ${section.content.questions?.length} items, first q malay: "${section.content.questions?.[0]?.malay}"`);
  }
}
await sql.end();
