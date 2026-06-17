import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { count } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [userCount] = await db.select({ count: count() }).from(schema.users);
  const [lessonCount] = await db.select({ count: count() }).from(schema.lessons);
  const [vocabCount] = await db.select({ count: count() }).from(schema.vocabulary);

  return NextResponse.json({ users: userCount.count, lessons: lessonCount.count, vocabulary: vocabCount.count });
}
