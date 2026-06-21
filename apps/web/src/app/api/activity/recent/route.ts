import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq, desc, sql } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Aggregate recent activity from daily_activity table
  const recentActivity = await db
    .select()
    .from(schema.dailyActivity)
    .where(eq(schema.dailyActivity.userId, session.user.id))
    .orderBy(desc(schema.dailyActivity.date))
    .limit(10);

  const activities = recentActivity.flatMap((day) => {
    const items: Array<{ type: string; description: string; date: string; xp: number }> = [];
    if (day.lessonsCompleted > 0) {
      items.push({
        type: "lesson",
        description: `Completed ${day.lessonsCompleted} lesson${day.lessonsCompleted > 1 ? "s" : ""}`,
        date: day.date,
        xp: Math.round(day.xpEarned * 0.6),
      });
    }
    if (day.wordsReviewed > 0) {
      items.push({
        type: "vocabulary",
        description: `Reviewed ${day.wordsReviewed} words`,
        date: day.date,
        xp: Math.round(day.xpEarned * 0.4),
      });
    }
    return items;
  });

  return NextResponse.json({ activities });
}
