// src\config\strategies\instagramStrategy.ts
import { Strategy as FacebookStrategy, Profile } from 'passport-facebook';
import { handleInstagramSignup } from '@/services/signupService';
import { handleInstagramLogin } from '@/services/loginService';
import { handleInstagramConnect } from '@/services/connectService';
import { AuthUserReq } from '@/interfaces/AuthUser';
import jwt from 'jsonwebtoken';



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
    passReqToCallback: true, // 👈 required for accessing req.user
  },
  async (req, accessToken, refreshToken, profile: Profile, done) => {
    try {
      const { _id, companyId } = (req as AuthUserReq).user;

      if (!_id || !companyId) {
        return done(new Error('Missing authenticated user or company context'), false);
      }

      const user = await handleInstagramLogin(
        accessToken,
        profile,
        { _id, companyId }, // ✅ pass minimal AuthUser
        refreshToken,
        undefined // optional expiresAt
      );

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);


// 🔹 Connect strategy (needs req.user from JWT)
export const instagramConnectStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: process.env.INSTAGRAM_CONNECT_CALLBACK_URL!,
    profileFields: ['id', 'displayName', 'emails', 'photos'],
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile: Profile, done) => {
    try {
      // 🔓 Manually extract JWT from cookie
      const token = req.cookies?.token;
      if (!token) return done(new Error('Missing JWT token'), false);

      // 🔑 Decode JWT to get user + companyId
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; companyId: string };

      if (!decoded?.id || !decoded?.companyId) {
        return done(new Error('Invalid JWT payload'), false);
      }

      const updatedUser = await handleInstagramConnect(
        accessToken,
        profile,
        { user: { _id: decoded.id, companyId: decoded.companyId } } as AuthUserReq, // 🧠 spoof user
        refreshToken
      );

      return done(null, updatedUser);
    } catch (err) {
      return done(err, false);
    }
  }
);
