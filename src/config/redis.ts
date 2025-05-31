// src\config\redis.ts
import { createClient } from 'redis';
import * as dotenv from 'dotenv';
dotenv.config();

export const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
        timeout: 10000, // ⬆ timeout

  },
  password: process.env.REDIS_PASSWORD,
});

redis.on('error', (err) => console.error('❌ Redis error:', err));

export async function initRedis() {
  try {
    await redis.connect();
    console.log('✅ Redis Connected');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
}

export const redisConnection = {
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
};