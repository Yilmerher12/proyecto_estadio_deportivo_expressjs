// ============================================
// APP — configuración de Express
// ============================================
import express from 'express';
import { morganMiddleware } from './config/logger';
import concessionsRouter from './routes/concessions.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(morganMiddleware);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/concessions', concessionsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
