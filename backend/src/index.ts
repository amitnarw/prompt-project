import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import promptRoutes from './routes/promptRoutes.js';
import playgroundRoutes from './routes/playgroundRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app: express.Express = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Prompt Verse API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/prompts', promptRoutes);
app.use('/api/playground', playgroundRoutes);

app.use(notFoundHandler);
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
