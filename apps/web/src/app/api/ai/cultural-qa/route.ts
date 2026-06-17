import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question } = await req.json();
  if (!question) return NextResponse.json({ error: "Question is required" }, { status: 400 });

  // TODO: Call LLM via OpenCode Go or Ollama
  const responses: Record<string, string> = {
    "wear": "For festivals and formal events, wear modest clothing that covers shoulders and knees. Batik shirts are a popular and appropriate choice for both men and women. For religious sites like mosques, women should cover their hair with a scarf and wear long sleeves. Shoes are always removed before entering.",
    "eat": "When dining in Malaysia, use your right hand for eating if not using utensils. Wait to be invited before starting a meal. It's polite to leave a small amount of food on your plate to indicate you're full. Compliment the cook! 'Sedap!' (Delicious!) is always appreciated.",
    "gift": "When visiting a Malaysian home, bring a small gift like fruit, pastries, or chocolates. Avoid giving alcohol to Muslim hosts. Gifts are typically offered with the right hand or both hands. It's polite to initially decline a gift once or twice before accepting.",
  };

  const answer = Object.entries(responses).find(([key]) =>
    question.toLowerCase().includes(key)
  )?.[1] ?? "Malaysian culture is rich and diverse, shaped by Malay, Chinese, Indian, and indigenous traditions. The key values are respect ('hormat'), politeness ('sopan'), and community ('komuniti'). When in doubt, observe what locals do and follow their lead. Malaysians are generally very understanding of foreigners learning their customs!";

  return NextResponse.json({ answer });
}
