// ============================================
// CONTROLLER: Concession
// ============================================

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as service from '../services/concession.service';
import {
  createConcessionSchema,
  updateConcessionSchema,
  objectIdSchema,
} from '../schemas/concession.schema';

function formatIssues(error: z.ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'root',
    message: issue.message,
  }));
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query['page']) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query['limit']) || 10));
    const search = req.query['search'] as string | undefined;
    const result = await service.getAll(page, limit, search);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = objectIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({ message: 'ID inválido', issues: formatIssues(parsedId.error) });
      return;
    }
    const item = await service.getById(parsedId.data);
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = createConcessionSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: 'Datos inválidos', issues: formatIssues(result.error) });
      return;
    }
    const item = await service.createConcession(result.data);
    res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = objectIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({ message: 'ID inválido', issues: formatIssues(parsedId.error) });
      return;
    }
    const result = updateConcessionSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: 'Datos inválidos', issues: formatIssues(result.error) });
      return;
    }
    const item = await service.updateConcession(parsedId.data, result.data);
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = objectIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({ message: 'ID inválido', issues: formatIssues(parsedId.error) });
      return;
    }
    await service.deleteConcession(parsedId.data);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
