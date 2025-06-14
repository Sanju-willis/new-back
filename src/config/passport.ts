// src\config\passport.ts
import passport from 'passport';
import { facebookStrategy } from './strategies/facebookStrategy';
import { instagramStrategy } from './strategies/instagramStrategy';
import { jwtStrategy } from './strategies/jwtStrategy';

passport.use('facebook', facebookStrategy);
passport.use('instagram', instagramStrategy);
passport.use('jwt', jwtStrategy);
