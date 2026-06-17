import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq, lte, or, isNull, and } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id!;

  const today = new Date().toISOString().split("T")[0];

  const dueEntries = await db.query.srsData.findMany({
    where: and(
      eq(schema.srsData.userId, userId),
      or(
        lte(schema.srsData.nextReviewDate, today),
        isNull(schema.srsData.nextReviewDate),
      ),
    ),
  });

  const dueIds = dueEntries.map((e) => e.vocabularyId);
  const words = dueIds.length
    ? await db.query.vocabulary.findMany({
        where: (v, { inArray }) => inArray(v.id, dueIds),
      })
    : [];

  return NextResponse.json({ words, srsEntries: dueEntries });
}
