import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, session.user!.id!),
    columns: { subscriptionTier: true, subscriptionStatus: true, subscriptionEnd: true },
  });

  return NextResponse.json({ tier: user?.subscriptionTier ?? "free", status: user?.subscriptionStatus, end: user?.subscriptionEnd });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tier } = await req.json();
  if (!["free", "premium", "enterprise"].includes(tier)) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

  await db.update(schema.users)
    .set({ subscriptionTier: tier })
    .where(eq(schema.users.id, session.user.id!));

  return NextResponse.json({ success: true, tier });
}
