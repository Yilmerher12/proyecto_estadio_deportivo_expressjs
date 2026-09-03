// ============================================
// CONTROLLER: Category
// ============================================

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/category.service';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';
import { objectIdSchema } from '../schemas/concession.schema';

function formatIssues(error: import('zod').ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'root',
    message: issue.message,
  }));
}

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const items = await service.getAll();
    res.json({ data: items });
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
    const result = createCategorySchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: 'Datos inválidos', issues: formatIssues(result.error) });
      return;
    }
    const item = await service.createCategory(result.data);
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
    const result = updateCategorySchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: 'Datos inválidos', issues: formatIssues(result.error) });
      return;
    }
    const item = await service.updateCategory(parsedId.data, result.data);
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
    await service.deleteCategory(parsedId.data);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
