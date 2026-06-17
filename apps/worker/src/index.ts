import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", { maxRetriesPerRequest: null });

export const audioQueue = new Queue("audio", { connection });
export const aiQueue = new Queue("ai-agents", { connection });

console.log("Worker process started. Queues: audio, ai-agents");
