// ============================================
// REPOSITORY: Concession (con populate de Category)
// ============================================

import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import { Concession, IConcession } from '../models/concession.model';
import { AppError } from '../errors/AppError';
import type { CreateConcessionDto, UpdateConcessionDto } from '../schemas/concession.schema';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export async function findAll(
  page: number,
  limit: number,
  search?: string,
): Promise<PaginatedResult<IConcession>> {
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = search
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  const [data, total] = await Promise.all([
    Concession.find(filter)
      .populate('category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Concession.countDocuments(filter),
  ]);

  return { data, total, page, totalPages: Math.ceil(total / limit) };
}

export async function findById(id: string): Promise<IConcession> {
  try {
    const concession = await Concession.findById(id).populate('category').lean();
    if (!concession) throw new AppError(404, 'Concesión no encontrada');
    return concession;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}

function mapDuplicateError(err: MongoServerError): AppError {
  const field = Object.keys(err.keyPattern ?? {})[0] ?? 'valor único';
  return new AppError(409, `Ya existe una concesión con ese ${field}`);
}

export async function create(dto: CreateConcessionDto): Promise<IConcession> {
  try {
    const concession = await Concession.create(dto);
    return concession.toJSON();
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) throw mapDuplicateError(err);
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID de categoría inválido');
    throw err;
  }
}

export async function update(id: string, dto: UpdateConcessionDto): Promise<IConcession> {
  try {
    const concession = await Concession.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    })
      .populate('category')
      .lean();
    if (!concession) throw new AppError(404, 'Concesión no encontrada');
    return concession;
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) throw mapDuplicateError(err);
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}

export async function remove(id: string): Promise<void> {
  try {
    const concession = await Concession.findByIdAndDelete(id).lean();
    if (!concession) throw new AppError(404, 'Concesión no encontrada');
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}
