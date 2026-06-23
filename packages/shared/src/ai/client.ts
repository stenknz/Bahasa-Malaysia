import OpenAI from "openai";
import type { AIAgentName, LLMProvider } from "./types";
import { agentConfigs } from "./agents";

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

export function resolveProvider(agentName?: AIAgentName): LLMProvider {
  const config = agentName ? agentConfigs[agentName] : undefined;
  const priority = config?.providerPriority ?? ["opencode-go", "ollama"];
  return priority.find((p) => {
    if (p === "opencode-go") return !!process.env.OPCODE_GO_API_KEY;
    return true;
  }) ?? "ollama";
}

export function getModel(agentName: AIAgentName): string {
  const config = agentConfigs[agentName];
  const provider = resolveProvider(agentName);
  return config.models[provider];
}

export function createAgentClient(agentName: AIAgentName): OpenAI {
  const provider = resolveProvider(agentName);

  return new OpenAI({
    baseURL: resolveBaseUrl(provider),
    apiKey: resolveApiKey(provider) || "sk-placeholder",
    timeout: 60000,
    maxRetries: 2,
  });
}
