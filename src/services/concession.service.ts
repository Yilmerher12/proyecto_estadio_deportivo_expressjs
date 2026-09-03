// ============================================
// SERVICE: Concession
// ============================================

import * as repo from '../repositories/concession.repository';
import * as categoryRepo from '../repositories/category.repository';
import { AppError } from '../errors/AppError';
import type { CreateConcessionDto, UpdateConcessionDto } from '../schemas/concession.schema';

export async function getAll(page: number, limit: number, search?: string) {
  return repo.findAll(page, limit, search);
}

export async function getById(id: string) {
  return repo.findById(id);
}

export async function createConcession(dto: CreateConcessionDto) {
  const categoryExists = await categoryRepo.exists(dto.category);
  if (!categoryExists) throw new AppError(400, 'La categoría especificada no existe');
  return repo.create(dto);
}

export async function updateConcession(id: string, dto: UpdateConcessionDto) {
  if (dto.category) {
    const categoryExists = await categoryRepo.exists(dto.category);
    if (!categoryExists) throw new AppError(400, 'La categoría especificada no existe');
  }
  return repo.update(id, dto);
}

export async function deleteConcession(id: string) {
  return repo.remove(id);
}
