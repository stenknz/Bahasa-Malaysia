import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const level = searchParams.get("level");
  const topic = searchParams.get("topic");

  const conditions = [eq(schema.lessons.status, "published")];
  if (level) conditions.push(eq(schema.lessons.level, level as any));
  if (topic) conditions.push(eq(schema.lessons.topic, topic));

  const lessons = await db.query.lessons.findMany({
    where: (l, { and }) => and(...conditions),
    orderBy: (l, { asc }) => [asc(l.order)],
    columns: { id: true, slug: true, title: true, description: true, level: true, topic: true, order: true, xpReward: true, isPremium: true },
  });

  return NextResponse.json(lessons);
}
