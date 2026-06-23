import { createAgentClient, getModel, SYSTEM_PROMPTS, type AgentResponse, type ConversationMessage } from "@malay/shared";

export async function generateReply(params: {
  scenario: string;
  level: string;
  history: ConversationMessage[];
  userMessage: string;
}): Promise<AgentResponse<string>> {
  try {
    const client = createAgentClient("conversation_partner");
    const history = params.history ?? [];
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      {
        role: "system",
        content: `${SYSTEM_PROMPTS.conversation_partner}\n\nScenario: ${params.scenario}\nUser level: ${params.level}`,
      },
      ...history.map((m) => ({
        role: m.role === "ai" ? "assistant" as const : "user" as const,
        content: m.content,
      })),
      { role: "user", content: params.userMessage },
    ];
    const completion = await client.chat.completions.create({
      model: getModel("conversation_partner"),
      messages,
      max_tokens: 200,
      temperature: 0.8,
    });
    return { success: true, data: completion.choices[0]?.message?.content ?? "Baik." };
  } catch (err) {
    console.error({ agent: "conversation_partner", error: err instanceof Error ? err.message : err, scenario: params.scenario });
    return { success: false, error: "Failed to generate reply" };
  }
}
