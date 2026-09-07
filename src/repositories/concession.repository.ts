import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import { ConcessionModel, IConcession } from '../models/concession.model';
import { CreateConcessionDto, UpdateConcessionDto } from '../schemas/concession.schema';
import { AppError } from '../errors/AppError';

function mapDuplicateError(err: MongoServerError): AppError {
  const field = Object.keys(err.keyPattern ?? {})[0] ?? 'valor único';
  return new AppError(409, `Ya existe una concesión con ese ${field}`);
}

export async function findAll(): Promise<IConcession[]> {
  return ConcessionModel.find().sort({ createdAt: -1 }).lean();
}

export async function findById(id: string): Promise<IConcession | null> {
  try {
    return await ConcessionModel.findById(id).lean();
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}

export async function create(
  data: CreateConcessionDto,
  createdBy: string
): Promise<IConcession> {
  try {
    const concession = await ConcessionModel.create({ ...data, createdBy });
    return concession.toJSON();
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) throw mapDuplicateError(err);
    throw err;
  }
}

export async function updateById(
  id: string,
  data: UpdateConcessionDto
): Promise<IConcession | null> {
  try {
    return await ConcessionModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    if (err instanceof MongoServerError && err.code === 11000) throw mapDuplicateError(err);
    throw err;
  }
}

export async function deleteById(id: string): Promise<boolean> {
  try {
    const deleted = await ConcessionModel.findByIdAndDelete(id).lean();
    return deleted !== null;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}
