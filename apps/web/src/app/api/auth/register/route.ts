import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, schema } from "@malay/db";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(schema.users).values({
    name: name || null,
    email,
    password: hashedPassword,
    role: "user",
  });

  return NextResponse.json({ success: true });
}
