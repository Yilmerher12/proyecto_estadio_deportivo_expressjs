import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import { concessionsRouter } from './routes/item.routes';

export function createApp(): Application {
  const app = express();

  app.use(express.json());


  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
    next();
  });
  

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  

  app.use('/api/v1/items', concessionsRouter);
  

  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
  

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  });

  return app;
}