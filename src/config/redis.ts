import Redis from 'ioredis';
import * as dotenv from 'dotenv';
dotenv.config();

// ❌ NO TLS used — this Redis endpoint is plain TCP
export const redis = new Redis({
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

// ✅ BullMQ also uses this connection
export const redisConnection = redis;
