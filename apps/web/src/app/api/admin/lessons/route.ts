import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";

export async function POST(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const [lesson] = await db.insert(schema.lessons).values(body).returning();
  return NextResponse.json(lesson);
}
