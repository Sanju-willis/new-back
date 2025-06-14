// src\config\strategies\jwtStrategy.ts
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '@/models/User';

export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromExtractors([
      (req) => req?.cookies?.token,
    ]),
    secretOrKey: process.env.JWT_SECRET!,
  },
  async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (!user) return done(null, false);

      const authUser = {
        ...user.toObject(),
        companyId: jwtPayload.companyId,
      };

      return done(null, authUser);
    } catch (err) {
      return done(err, false);
    }
  }
);
