// ============================================
// CONTROLLER — Interfaz HTTP
// ============================================
// Reglas de esta capa:
// - Exactamente 3 pasos: extraer → llamar service → responder
// - Sin lógica de negocio (no ifs de dominio, no cálculos)
// - Maneja los 404 cuando el service retorna undefined
// - Siempre usar try/catch y pasar errores a next(err)

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/concessions.service';
import { CreateConcessionDto, ErrorResponse, UpdateConcessionDto } from '../types';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const dto = req.body as CreateConcessionDto;
        const product = await service.create(dto);
        res.status(201).json({ data: product });
    } catch (err) {
        next(err);
    }
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const page = Number(req.query['page'] ?? 1);
        const limit = Number(req.query['limit'] ?? 10);
        const result = await service.findAll({ page, limit });
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = Number(req.params['id']);
        const product = await service.findById(id);
        if (!product) {
            const response: ErrorResponse = { error: 'Not Found', message: `Product ${id} not found` };
            res.status(404).json(response);
            return;
        }
        res.json({ data: product });
    } catch (err) {
        next(err);
    }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = Number(req.params['id']);
        const dto = req.body as UpdateConcessionDto;
        const product = await service.update(id, dto);
        if (!product) {
            const response: ErrorResponse = { error: 'Not Found', message: `Product ${id} not found` };
            res.status(404).json(response);
            return;
        }
        res.json({ data: product });
    } catch (err) {
        next(err);
    }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = Number(req.params['id']);
        const removed = await service.remove(id);
        if (!removed) {
            const response: ErrorResponse = { error: 'Not Found', message: `Product ${id} not found` };
            res.status(404).json(response);
            return;
        }
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}