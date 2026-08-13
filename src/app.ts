// ============================================
// APP — Configuración Express
// ============================================
import express from 'express';
import { concessionsRouter } from './routes/concessions.routes';
import { ErrorResponse } from './types';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', week: '03', project: 'api-arquitectura' });
});

app.use('/api/v1/concessions', concessionsRouter);

// Error handler — no modificar
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.message);
    const response: ErrorResponse = {
        error: 'Internal Server Error',
        message: err.message,
    };
    res.status(500).json(response);
});

export default app;