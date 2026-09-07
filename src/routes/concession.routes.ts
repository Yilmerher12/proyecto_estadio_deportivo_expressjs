import { Router } from 'express';
import * as concessionController from '../controllers/concession.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: Router = Router();

// Todas las rutas de este router requieren autenticación
router.use(authMiddleware);

// GET /api/v1/concessions — listar todas
router.get('/', concessionController.getAll);

// GET /api/v1/concessions/:id — obtener una por ID
router.get('/:id', concessionController.getById);

// POST /api/v1/concessions — crear una nueva
router.post('/', concessionController.create);

// PATCH /api/v1/concessions/:id — actualizar parcialmente
router.patch('/:id', concessionController.update);

// DELETE /api/v1/concessions/:id — eliminar
router.delete('/:id', concessionController.remove);

export default router;
