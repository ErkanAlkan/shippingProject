import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import prisma from './prisma';
import routes from './routes/routes';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
