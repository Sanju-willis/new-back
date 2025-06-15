// src\config\passport.ts
import passport from 'passport';
import { facebookSignupStrategy, facebookLoginStrategy, facebookConnectStrategy} from './strategies/facebookStrategy';
import {
  instagramSignupStrategy,
  instagramLoginStrategy,
  instagramConnectStrategy
} from './strategies/instagramStrategy';import { jwtStrategy } from './strategies/jwtStrategy';


passport.use('facebook-signup', facebookSignupStrategy);
passport.use('facebook-login', facebookLoginStrategy);
passport.use('facebook-connect', facebookConnectStrategy);

passport.use('instagram-signup', instagramSignupStrategy);
passport.use('instagram-login', instagramLoginStrategy);
passport.use('instagram-connect', instagramConnectStrategy);
passport.use('jwt', jwtStrategy);
