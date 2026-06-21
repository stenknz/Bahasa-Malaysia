import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq, gte, desc, sql } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const startDate = thirtyDaysAgo.toISOString().split("T")[0];

  // Get daily activity for last 30 days
  const records = await db
    .select()
    .from(schema.dailyActivity)
    .where(
      sql`${schema.dailyActivity.userId} = ${session.user.id} AND ${schema.dailyActivity.date} >= ${startDate}`
    )
    .orderBy(desc(schema.dailyActivity.date));

  // Fill in missing days with zeroes
  const history: Array<{ date: string; xp: number; lessons: number; words: number }> = [];
  const recordMap = new Map(records.map((r) => [r.date, r]));
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const record = recordMap.get(dateStr);
    history.push({
      date: dateStr,
      xp: record?.xpEarned ?? 0,
      lessons: record?.lessonsCompleted ?? 0,
      words: record?.wordsReviewed ?? 0,
    });
  }

  return NextResponse.json({ history });
}
