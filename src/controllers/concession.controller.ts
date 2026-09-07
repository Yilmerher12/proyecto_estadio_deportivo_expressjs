import { Request, Response, NextFunction } from 'express';
import * as concessionService from '../services/concession.service';
import { createConcessionSchema, updateConcessionSchema } from '../schemas/concession.schema';

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const concessions = await concessionService.getAll();
    res.status(200).json(concessions);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const concession = await concessionService.getById(id);
    res.status(200).json(concession);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = createConcessionSchema.parse(req.body);
    const userId = req.user!.sub;
    const concession = await concessionService.create(dto, userId);
    res.status(201).json(concession);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = updateConcessionSchema.parse(req.body);
    const id = req.params.id as string;
    const concession = await concessionService.update(id, dto);
    res.status(200).json(concession);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    await concessionService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
