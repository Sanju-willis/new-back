// src\config\strategies\googleAnalyticsStrategy.ts
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { handleGoogleLogin } from '@/services/authService';

export const googleAnalyticsStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/analytics.readonly']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await handleGoogleLogin(accessToken, profile);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);