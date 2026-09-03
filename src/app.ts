// src/app.ts — Configuración de la aplicación Express
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import concessionsRouter from './routes/concessions.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/concessions', concessionsRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
