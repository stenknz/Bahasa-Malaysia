import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const updateData: Record<string, unknown> = {};

  if (body.level) updateData.level = body.level;
  if (body.preferences) updateData.preferences = body.preferences;

  await db.update(schema.users)
    .set(updateData)
    .where(eq(schema.users.id, session.user.id!));

  return NextResponse.json({ success: true });
}
