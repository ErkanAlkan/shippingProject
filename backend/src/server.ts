import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/shipRoutes/shipRoutes';
import carbonRoutes from './routes/carbonRoutes/carbonRoutes';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use('/api/ship', routes);
app.use('/api/carbon', carbonRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
