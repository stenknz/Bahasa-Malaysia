import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq, and } from "drizzle-orm";
import { calculateSrs, getNextReviewDate, getStatus } from "@malay/shared";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id!;
  const { id } = await params;
  const { grade } = await req.json();

  const existing = await db.query.srsData.findFirst({
    where: and(eq(schema.srsData.userId, userId), eq(schema.srsData.vocabularyId, id)),
  });

  const card = existing
    ? { repetitions: existing.repetitions, easeFactor: existing.easeFactor, interval: existing.interval }
    : { repetitions: 0, easeFactor: 250, interval: 0 };

  const result = calculateSrs(card, grade);
  const nextDate = getNextReviewDate(result.interval);
  const status = getStatus(result.repetitions, result.interval);

  if (existing) {
    await db.update(schema.srsData)
      .set({
        repetitions: result.repetitions,
        easeFactor: result.easeFactor,
        interval: result.interval,
        lastReviewDate: new Date().toISOString().split("T")[0],
        nextReviewDate: nextDate,
        lastGrade: grade,
        status,
      })
      .where(eq(schema.srsData.id, existing.id));
  } else {
    await db.insert(schema.srsData).values({
      userId,
      vocabularyId: id,
      repetitions: result.repetitions,
      easeFactor: result.easeFactor,
      interval: result.interval,
      lastReviewDate: new Date().toISOString().split("T")[0],
      nextReviewDate: nextDate,
      lastGrade: grade,
      status,
    });
  }

  return NextResponse.json({ success: true, status, nextReviewDate: nextDate });
}
