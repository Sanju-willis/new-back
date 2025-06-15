// src\config\strategies\instagramStrategy.ts
import { Strategy as FacebookStrategy, Profile } from 'passport-facebook';
import { handleInstagramSignup } from '@/services/signupService';
import { handleInstagramLogin } from '@/services/loginService';
import { handleInstagramConnect } from '@/services/connectService';

// 🔹 Signup strategy
export const instagramSignupStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: process.env.INSTAGRAM_SIGNUP_CALLBACK_URL!,
    profileFields: ['id', 'displayName', 'emails', 'photos'],
  },
  async (accessToken, refreshToken, profile: Profile, done) => {
    try {
      const user = await handleInstagramSignup(accessToken, profile);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);

// 🔹 Login strategy
export const instagramLoginStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: process.env.INSTAGRAM_LOGIN_CALLBACK_URL!,
    profileFields: ['id', 'displayName', 'emails', 'photos'],
  },
  async (accessToken, refreshToken, profile: Profile, done) => {
    try {
      const user = await handleInstagramLogin(accessToken, profile);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);

// 🔹 Connect strategy
export const instagramConnectStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: process.env.INSTAGRAM_CONNECT_CALLBACK_URL!,
    profileFields: ['id', 'displayName', 'emails', 'photos'],
  },
  async (accessToken, refreshToken, profile: Profile, done) => {
    try {
      const user = await handleInstagramConnect(accessToken, profile);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);
