// src/services/concessions.service.ts — Lógica de negocio
import * as repo from '../repositories/concessions.repository';
import { AppError } from '../errors/AppError';
import type { CreateConcessionDto, UpdateConcessionDto } from '../schemas/concessions.schema';

export async function listConcessions(page: number, limit: number) {
  return repo.findAll(page, limit);
}

export async function getConcession(id: string) {
  const concession = await repo.findById(id);
  if (!concession) throw new AppError(404, 'Concesión no encontrada');
  return concession;
}

export async function createConcession(data: CreateConcessionDto) {
  return repo.create(data);
}

export async function updateConcession(id: string, data: UpdateConcessionDto) {
  return repo.update(id, data);
}

export async function deleteConcession(id: string): Promise<void> {
  await repo.remove(id);
}
