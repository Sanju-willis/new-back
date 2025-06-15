// src\config\strategies\facebookStrategy.ts
import { Strategy as FacebookStrategy, Profile } from 'passport-facebook';
import { handleFacebookSignup } from '@/services/signupService';
import { handleFacebookLogin } from '@/services/loginService';
import { handleFacebookConnect } from '@/services/connectService';

export const facebookSignupStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: process.env.FACEBOOK_SIGNUP_CALLBACK_URL!,
    profileFields: ['id', 'displayName', 'emails'],
    passReqToCallback: false
  },
  async (accessToken, refreshToken, profile: Profile, done) => {
    try {
      const user = await handleFacebookSignup(accessToken, profile);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);

export const facebookLoginStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: process.env.FACEBOOK_LOGIN_CALLBACK_URL!,
    profileFields: ['id', 'displayName', 'emails'],
    passReqToCallback: false
  },
  async (accessToken, refreshToken, profile: Profile, done) => {
    try {
      const user = await handleFacebookLogin(accessToken, profile);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);

export const facebookConnectStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: process.env.FACEBOOK_CONNECT_CALLBACK_URL!,
    profileFields: ['id', 'displayName', 'emails'],
    passReqToCallback: false
  },
  async (accessToken, refreshToken, profile: Profile, done) => {
    try {
      const user = await handleFacebookConnect(accessToken, profile);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);
