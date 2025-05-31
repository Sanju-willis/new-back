// src\utils\chatHistory.ts
import { redis } from '../config/redis';

const CHAT_TTL = 60 * 15; // 15 minutes

type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export async function getChatHistory(userId: string): Promise<ChatMessage[]> {
  const key = `chat:${userId}`;
  const raw = await redis.get(key);
  return raw ? JSON.parse(raw) : [];
}

export async function saveChatHistory(userId: string, history: ChatMessage[]): Promise<void> {
  const key = `chat:${userId}`;
await redis.set(key, JSON.stringify(history), {
  EX: 60 * 15, // 15 minutes
});
}
