// src\config\strategies\tiktokStrategy.ts
import { Strategy as TikTokStrategy } from 'passport-tiktok-auth';
import { handleTikTokLogin } from '@/services/authService';

export const tiktokStrategy = new TikTokStrategy(
  {
    clientID: process.env.TIKTOK_CLIENT_ID!,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
    callbackURL: process.env.TIKTOK_CALLBACK_URL!,
    scope: ['user.info.basic']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await handleTikTokLogin(accessToken, profile);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);
