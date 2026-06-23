import OpenAI from "openai";
import type { AIAgentName, LLMProvider } from "./types";
import { agentConfigs } from "./agents";

function resolveProvider(): LLMProvider {
  if (process.env.OPCODE_GO_API_KEY) return "opencode-go";
  return "ollama";
}

function resolveBaseUrl(provider: LLMProvider): string {
  if (provider === "opencode-go") {
    return process.env.OPCODE_GO_API_URL ?? "https://opencode.ai/zen/go/v1";
  }
  return process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1";
}

function resolveApiKey(provider: LLMProvider): string {
  if (provider === "opencode-go") {
    return process.env.OPCODE_GO_API_KEY ?? "";
  }
  return "";
}

export function createAgentClient(agentName: AIAgentName): OpenAI {
  const config = agentConfigs[agentName];
  const provider = config.providerPriority.find((p) => {
    if (p === "opencode-go") return !!process.env.OPCODE_GO_API_KEY;
    return true; // ollama always available as fallback
  }) ?? "ollama";

  return new OpenAI({
    baseURL: resolveBaseUrl(provider),
    apiKey: resolveApiKey(provider) || "sk-placeholder",
  });
}
