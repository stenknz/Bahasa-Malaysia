import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = session.user;
  const { slug } = await params;

  const lesson = await db.query.lessons.findFirst({ where: (l, { eq }) => eq(l.slug, slug) });
  if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const { score, timeSpent, sectionProgress } = body;

  const existing = await db.query.userProgress.findFirst({
    where: (p, { eq, and }) => and(eq(p.userId, user.id!), eq(p.lessonId, lesson.id)),
  });

  if (existing) {
    await db.update(schema.userProgress)
      .set({ score, timeSpent, sectionProgress, completed: true, completedAt: new Date() })
      .where(eq(schema.userProgress.id, existing.id));
  } else {
    await db.insert(schema.userProgress).values({
      userId: user.id!,
      lessonId: lesson.id,
      score, timeSpent, sectionProgress,
      completed: true,
      completedAt: new Date(),
    });
  }

  return NextResponse.json({ success: true });
}
