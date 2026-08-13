// ============================================
// ROUTES — Mapeo de URLs a controllers
// ============================================
// Las rutas solo conectan: URL + Método HTTP → función del controller
// No deben contener lógica ni acceder a servicios directamente.

import { Router } from 'express';
import * as controller from '../controllers/concessions.controller';

export const concessionsRouter = Router();

concessionsRouter.get('/', controller.getAll);
concessionsRouter.get('/:id', controller.getById);
concessionsRouter.post('/', controller.create);
concessionsRouter.put('/:id', controller.update);
concessionsRouter.delete('/:id', controller.remove);