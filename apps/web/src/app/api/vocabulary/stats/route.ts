import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id!;

  const entries = await db.query.srsData.findMany({
    where: eq(schema.srsData.userId, userId),
  });

  const stats = {
    new: 0,
    learning: 0,
    familiar: 0,
    mastered: 0,
    total: entries.length,
    dueToday: 0,
  };

  const today = new Date().toISOString().split("T")[0];
  for (const entry of entries) {
    const status = entry.status as keyof typeof stats;
    if (status in stats) stats[status]++;
    if (entry.nextReviewDate && entry.nextReviewDate <= today) stats.dueToday++;
  }

  return NextResponse.json(stats);
}
