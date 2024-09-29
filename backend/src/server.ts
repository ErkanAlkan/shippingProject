import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import { sessionMiddleware } from './sessionSetup';
import shipRoutes from './routes/shipRoutes/shipRoutes';
import carbon from './routes/carbonRoutes/carbonRoutes';
import vessel from './routes/vesselRoutes/vessel';
import vesselVariable from './routes/vesselRoutes/vesselVariable';
import authRoutes from './routes/authRoutes/authRoutes'; 

dotenv.config();

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("PostgreSQL Password:", process.env.DB_PASSWORD);

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/ship', shipRoutes);
app.use('/api/carbon', carbon);
app.use('/api/vessel', vessel);
app.use('/api/vessel-variable', vesselVariable);
app.use('/api/auth', authRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
