import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id!;

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");

  const conditions: any[] = [];
  if (category) conditions.push(eq(schema.vocabulary.category, category));
  if (difficulty) conditions.push(eq(schema.vocabulary.difficulty, difficulty as any));

  const words = await db.query.vocabulary.findMany({
    where: conditions.length ? (v, { and }) => and(...conditions) : undefined,
    orderBy: (v, { asc }) => [asc(v.malay)],
  });

  const srsEntries = await db.query.srsData.findMany({
    where: (s, { eq }) => eq(s.userId, userId),
  });
  const srsMap = new Map(srsEntries.map((s) => [s.vocabularyId, s]));

  const result = words.map((w) => ({
    ...w,
    srs: srsMap.get(w.id) ?? { status: "new", repetitions: 0, nextReviewDate: null },
  }));

  return NextResponse.json(result);
}
