import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id!;
  const allAchievements = await db.query.achievements.findMany();
  const unlocked = await db.query.userAchievements.findMany({
    where: (ua, { eq }) => eq(ua.userId, userId),
  });
  const unlockedIds = new Set(unlocked.map((u) => u.achievementId));

  const result = allAchievements.map((a) => ({
    ...a,
    unlocked: unlockedIds.has(a.id),
    unlockedAt: unlocked.find((u) => u.achievementId === a.id)?.unlockedAt ?? null,
  }));

  return NextResponse.json(result);
}
