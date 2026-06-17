import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";

const scenarios = {
  restaurant: "You are a waiter at a Malaysian restaurant. The user is a customer. Greet them and take their order.",
  airport: "You are an airport staff member. Help the user check in for their flight.",
  hotel: "You are a hotel receptionist. The user wants to check in.",
  shopping: "You are a shopkeeper. The user wants to buy something.",
  general: "You are a friendly Malaysian helping a foreigner practice Bahasa Malaysia.",
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { scenario = "general", level = "beginner" } = await req.json();

  const [conversation] = await db.insert(schema.conversationSessions).values({
    userId: session.user.id!,
    scenario,
    level,
    messages: [],
  }).returning();

  return NextResponse.json({ id: conversation.id, prompt: scenarios[scenario as keyof typeof scenarios] ?? scenarios.general });
}
