export interface AgentConfig {
  endpoint: string;
  model: string;
  apiKey: string;
}

export const agentConfigs: Record<string, AgentConfig> = {
  lesson_creator: {
    endpoint: process.env.OPCODE_GO_API_URL ?? process.env.OLLAMA_BASE_URL ?? "https://opencode.ai/zen/go/v1/chat/completions",
    model: "deepseek-v4-flash",
    apiKey: process.env.OPCODE_GO_API_KEY ?? "",
  },
  pronunciation_coach: {
    endpoint: process.env.OPCODE_GO_API_URL ?? process.env.OLLAMA_BASE_URL ?? "https://opencode.ai/zen/go/v1/chat/completions",
    model: "deepseek-v4-flash",
    apiKey: process.env.OPCODE_GO_API_KEY ?? "",
  },
  grammar_tutor: {
    endpoint: process.env.OPCODE_GO_API_URL ?? process.env.OLLAMA_BASE_URL ?? "https://opencode.ai/zen/go/v1/chat/completions",
    model: "deepseek-v4-pro",
    apiKey: process.env.OPCODE_GO_API_KEY ?? "",
  },
  conversation_partner: {
    endpoint: process.env.OPCODE_GO_API_URL ?? process.env.OLLAMA_BASE_URL ?? "https://opencode.ai/zen/go/v1/chat/completions",
    model: "deepseek-v4-pro",
    apiKey: process.env.OPCODE_GO_API_KEY ?? "",
  },
  progress_coach: {
    endpoint: process.env.OPCODE_GO_API_URL ?? process.env.OLLAMA_BASE_URL ?? "https://opencode.ai/zen/go/v1/chat/completions",
    model: "deepseek-v4-flash",
    apiKey: process.env.OPCODE_GO_API_KEY ?? "",
  },
  cultural_guide: {
    endpoint: process.env.OPCODE_GO_API_URL ?? process.env.OLLAMA_BASE_URL ?? "https://opencode.ai/zen/go/v1/chat/completions",
    model: "deepseek-v4-pro",
    apiKey: process.env.OPCODE_GO_API_KEY ?? "",
  },
};
