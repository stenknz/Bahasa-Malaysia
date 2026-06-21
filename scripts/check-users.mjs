import postgres from "postgres";
import bcrypt from "bcryptjs";

const sql = postgres("postgres://malaylang:malaylang@localhost:5432/malaylang");
const users = await sql`SELECT id, email, password, role FROM users`;
console.log("Users in DB:", users.length);
for (const u of users) {
  console.log(`  - ${u.email} | role: ${u.role} | has password: ${u.password ? "yes" : "no"}`);
}
if (users.length > 0) {
  const valid = await bcrypt.compare("testpassword123", users[0].password);
  console.log("Password check (testpassword123):", valid);
}
await sql.end();
