// src\app.ts
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import './config/passport';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute';
import chatRoute from './routes/chatRoute';
import { dataLog } from './utils/debuglog';
import onboardRouter from './routes/onboardRoute';
import syncRoute from './routes/syncRoute';
import campaignOverviewRoutes from './routes/campaignOverviewRoutes'


const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,}));
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());


// Routes
app.use('/auth', authRoute);
app.use('/chat', chatRoute);
app.use('/onboard', onboardRouter);
app.use('/sync', syncRoute);
app.use('/patch', syncRoute);
app.use('/', campaignOverviewRoutes);




export default app;
