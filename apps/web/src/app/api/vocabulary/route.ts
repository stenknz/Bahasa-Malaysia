import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const words = await db.query.vocabulary.findMany({
    orderBy: (v, { asc }) => [asc(v.malay)],
  });

  return NextResponse.json(words);
}
