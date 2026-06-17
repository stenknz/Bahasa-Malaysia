import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { challengeId, score } = await req.json();
  const userId = session.user.id!;
  const today = new Date().toISOString().split("T")[0];

  const existing = await db.query.userDailyChallenges.findFirst({
    where: (c, { eq, and }) => and(
      eq(c.userId, userId),
      eq(c.challengeId, challengeId),
      eq(c.date, today),
    ),
  });

  if (existing) return NextResponse.json({ error: "Already claimed today" }, { status: 400 });

  const challenge = await db.query.dailyChallenges.findFirst({
    where: (c, { eq }) => eq(c.id, challengeId),
  });
  if (!challenge) return NextResponse.json({ error: "Challenge not found" }, { status: 404 });

  await db.insert(schema.userDailyChallenges).values({
    userId,
    challengeId,
    date: today,
    completed: true,
    score,
  });

  await db.update(schema.users)
    .set({ totalXp: sql`${schema.users.totalXp} + ${challenge.xpReward}` })
    .where(eq(schema.users.id, userId));

  return NextResponse.json({ success: true, xpAwarded: challenge.xpReward });
}
