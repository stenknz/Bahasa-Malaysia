import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq, count } from "drizzle-orm";
import { calculateLevel } from "@malay/shared";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id!;
  const [user, lessonCount, vocabCount, srsStats] = await Promise.all([
    db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
      columns: { totalXp: true, currentStreak: true, longestStreak: true },
    }),
    db.select({ count: count() }).from(schema.userProgress).where(eq(schema.userProgress.userId, userId)),
    db.select({ count: count() }).from(schema.srsData).where(eq(schema.srsData.userId, userId)),
    db.query.srsData.findMany({ where: (s, { eq }) => eq(s.userId, userId) }),
  ]);

  const mastered = srsStats.filter((s) => s.status === "mastered").length;
  const level = user ? calculateLevel(user.totalXp) : 0;

  return NextResponse.json({
    totalXp: user?.totalXp ?? 0,
    level,
    currentStreak: user?.currentStreak ?? 0,
    longestStreak: user?.longestStreak ?? 0,
    lessonsCompleted: lessonCount[0]?.count ?? 0,
    vocabularyLearned: vocabCount[0]?.count ?? 0,
    vocabularyMastered: mastered,
  });
}
