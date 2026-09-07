import { IConcession } from '../models/concession.model';
import * as concessionRepository from '../repositories/concession.repository';
import { CreateConcessionDto, UpdateConcessionDto } from '../schemas/concession.schema';
import { AppError } from '../errors/AppError';

export async function getAll(): Promise<IConcession[]> {
  return concessionRepository.findAll();
}

export async function getById(id: string): Promise<IConcession> {
  const concession = await concessionRepository.findById(id);
  if (!concession) throw new AppError(404, 'Concesión no encontrada');
  return concession;
}

export async function create(
  dto: CreateConcessionDto,
  userId: string
): Promise<IConcession> {
  return concessionRepository.create(dto, userId);
}

export async function update(
  id: string,
  dto: UpdateConcessionDto
): Promise<IConcession> {
  const updated = await concessionRepository.updateById(id, dto);
  if (!updated) throw new AppError(404, 'Concesión no encontrada');
  return updated;
}

export async function remove(id: string): Promise<void> {
  const deleted = await concessionRepository.deleteById(id);
  if (!deleted) throw new AppError(404, 'Concesión no encontrada');
}
