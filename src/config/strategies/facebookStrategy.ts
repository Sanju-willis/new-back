// src\config\strategies\facebookStrategy.ts
import { Strategy as FacebookStrategy, Profile } from 'passport-facebook';
import { handleFacebookLogin } from '@/services/authService';

export const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
    profileFields: ['id', 'displayName', 'emails', 'photos'],
  },
  async (accessToken: string, refreshToken: string, profile: Profile, done) => {
    try {
      const user = await handleFacebookLogin(accessToken, profile);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);
