import { Router } from 'express';
import * as store from '../store.js';
import type { Request, Response } from 'express';
import type { CreateItemDto, UpdateItemDto } from '../types.js';



export const concessionsRouter = Router();

function isValidCreatePayload(body: unknown): body is CreateItemDto {
    if (typeof body !== 'object' || body === null) return false;

    const { name, price, type } = body as Record<string, unknown>;
    return (
        typeof name === 'string' &&
        name.trim().length > 0 &&
        typeof price === 'number' &&
        price >= 0 &&
        typeof type === 'string' &&
        type.trim().length > 0
    );
}

// GET /items — Listar todos los recursos
// TODO: Implementar usando store.getAll()
// Status: 200
concessionsRouter.get('/', (_req, res) => {
    // TODO: retornar todos los ítems
    res.json(store.getAll());
});

// GET /items/:id — Obtener recurso por ID
// TODO: Implementar usando store.getById(id)
// Status: 200 si existe | 404 si no existe
concessionsRouter.get('/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const product = store.getById(id);
    // TODO: obtener el ítem y manejar 404
    if(!product){
        res.status(404).json({ error: `Product with id ${id} not found'`});
        return;
    }

    res.json(product);
});

// POST /items — Crear nuevo recurso
// TODO: Implementar usando store.create(dto)
// Status: 201 con el recurso creado
concessionsRouter.post('/', (req: Request, res: Response) => {
    if (!isValidCreatePayload(req.body)) {
        res.status(400).json({
            error: 'name (string), price (number) and type (string) are required',
        });
        return;
    };
    const dto: CreateItemDto = {
        name: req.body.name,
        description: typeof req.body.description === 'string' ? req.body.description : '',
        type: req.body.type,
        price: req.body.price,
        stock: typeof req.body.stock === 'number' ? req.body.stock : 0,
        available: typeof req.body.available === 'boolean' ? req.body.available : true,
    };

    const created = store.create(dto);
    res.status(201).json(created);
});

concessionsRouter.put('/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const body: unknown = req.body;

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        res.status(400).json({ error: 'Request body must be an object with fields to update' });
        return;
    }

    const updated = store.update(id, body as UpdateItemDto);
    if (!updated) {
        res.status(404).json({ error: `Product with id ${id}  not found` });
        return;
    }

    res.json(updated);
});

// DELETE /products/:id — Eliminar producto
concessionsRouter.delete('/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const removed = store.remove(id);

    if (!removed) {
        res.status(404).json({ error: `Product with id ${id} not found` });
        return;
    }

    res.status(204).send();
});