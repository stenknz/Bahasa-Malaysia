import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const lesson = await db.query.lessons.findFirst({
    where: (l, { eq }) => eq(l.slug, slug),
  });
  if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(lesson);
}
