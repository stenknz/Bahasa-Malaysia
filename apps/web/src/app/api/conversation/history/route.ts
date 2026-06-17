import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const history = await db.query.conversationSessions.findMany({
    where: (c, { eq }) => eq(c.userId, userId),
    orderBy: (c, { desc }) => [desc(c.startedAt)],
    columns: { id: true, scenario: true, level: true, startedAt: true, endedAt: true, scores: true },
  });

  return NextResponse.json(history);
}
