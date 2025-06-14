// src\config\strategies\linkedinStrategy.ts
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { handleLinkedInLogin } from '@/services/authService';

export const linkedinStrategy = new LinkedInStrategy(
  {
    clientID: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    callbackURL: process.env.LINKEDIN_CALLBACK_URL!,
    scope: ['r_emailaddress', 'r_liteprofile']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await handleLinkedInLogin(accessToken, profile);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);