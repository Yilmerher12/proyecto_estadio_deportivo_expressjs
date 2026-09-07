import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import concessionRouter from './routes/concession.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app: Express = express();

app.use(express.json());
app.use(cookieParser());

// Rutas de autenticación
app.use('/api/v1/auth', authRouter);

// Recurso principal del dominio: concesiones del estadio
app.use('/api/v1/concessions', concessionRouter);

// Middlewares de errores (siempre al final)
app.use(notFound);
app.use(errorHandler);
