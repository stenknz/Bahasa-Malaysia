export type AIAgentName =
  | "grammar_tutor"
  | "cultural_guide"
  | "conversation_partner"
  | "pronunciation_coach";

export type LLMProvider = "opencode-go" | "ollama";

export interface AgentResponse<T = string> {
  success: boolean;
  data?: T;
  error?: string;
}
