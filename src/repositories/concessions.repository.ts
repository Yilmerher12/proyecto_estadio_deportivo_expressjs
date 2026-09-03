// src/repositories/concessions.repository.ts — Acceso a datos con Prisma
import { Prisma, Concession } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';
import type { CreateConcessionDto, UpdateConcessionDto } from '../schemas/concessions.schema';

const withCategory = { category: true } satisfies Prisma.ConcessionInclude;

export type ConcessionWithCategory = Prisma.ConcessionGetPayload<{ include: typeof withCategory }>;

export async function findAll(
  page: number,
  limit: number,
): Promise<{ data: ConcessionWithCategory[]; total: number; page: number; limit: number }> {
  const [data, total] = await Promise.all([
    prisma.concession.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: withCategory,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.concession.count(),
  ]);

  return { data, total, page, limit };
}

export async function findById(id: string): Promise<ConcessionWithCategory | null> {
  return prisma.concession.findUnique({ where: { id }, include: withCategory });
}

export async function create(data: CreateConcessionDto): Promise<Concession> {
  try {
    return await prisma.concession.create({ data });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(409, `Ya existe una concesión con ese ${(err.meta?.['target'] as string[] | undefined)?.join(', ') ?? 'valor único'}`);
    }
    throw err;
  }
}

export async function update(id: string, data: UpdateConcessionDto): Promise<Concession> {
  try {
    return await prisma.concession.update({ where: { id }, data });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2025') throw new AppError(404, 'Concesión no encontrada');
      if (err.code === 'P2002') {
        throw new AppError(409, `Ya existe una concesión con ese ${(err.meta?.['target'] as string[] | undefined)?.join(', ') ?? 'valor único'}`);
      }
    }
    throw err;
  }
}

export async function remove(id: string): Promise<void> {
  try {
    await prisma.concession.delete({ where: { id } });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, 'Concesión no encontrada');
    }
    throw err;
  }
}
