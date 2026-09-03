// ============================================
// app.ts — Configuración de Express
// ============================================

import express from 'express';
import categoryRouter from './routes/category.routes';
import concessionRouter from './routes/concession.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/concessions', concessionRouter);

app.use(notFound);
app.use(errorHandler);
