// src\config\passport.ts
import passport from 'passport';
import { Strategy as FacebookStrategy, Profile } from 'passport-facebook';
import dotenv from 'dotenv';
import User from '../models/User';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { handleFacebookLogin } from '../services/authService';
import { dataLog   } from '../utils/debuglog';

dotenv.config();

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
    profileFields: ['id', 'displayName', 'emails', 'photos']
  },

  async (accessToken: string, refreshToken: string, profile: Profile, done) => {
    try {
      const user = await handleFacebookLogin(accessToken, profile);
      
    dataLog('🔁 [DATA] Passport out:', user);
     
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
));

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.token,
      ]),
      secretOrKey: process.env.JWT_SECRET!,
    },
    async (jwtPayload, done) => {
      try {
      console.log('🔑 Decoded JWT payload:', jwtPayload);

        const user = await User.findById(jwtPayload.id);
        if (!user) return done(null, false);

        // ✅ Return merged object, not mutated mongoose doc
        const authUser = {
          ...user.toObject(), // flatten the Mongoose doc
          companyId: jwtPayload.companyId,
        };

        return done(null, authUser);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);


