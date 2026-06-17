import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq } from "drizzle-orm";
import { calculateLevel } from "@malay/shared";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id!;
  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
    columns: { totalXp: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const level = calculateLevel(user.totalXp);
  const xpForNext = (level + 1) * (level + 1) * 100;

  return NextResponse.json({ totalXp: user.totalXp, level, xpForNextLevel: xpForNext });
}
