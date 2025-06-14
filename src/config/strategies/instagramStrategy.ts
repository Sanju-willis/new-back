// src\config\strategies\instagramStrategy.ts
import { Strategy as FacebookStrategy, Profile } from 'passport-facebook';
import { handleInstagramLogin } from '@/services/authService';

export const instagramStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: process.env.INSTAGRAM_CALLBACK_URL!,
    profileFields: ['id', 'displayName', 'emails', 'photos'],
  },
  async (accessToken: string, refreshToken: string, profile: Profile, done) => {
    try {
      const user = await handleInstagramLogin(accessToken, profile);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);
