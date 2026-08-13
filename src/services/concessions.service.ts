// ============================================
// SERVICE — Lógica de negocio
// ============================================
// Reglas de esta capa:
// - CERO imports de Express (sin Request, Response, NextFunction)
// - Llama al repository para acceder a datos
// - Contiene la paginación y validaciones de dominio
// - Retorna undefined cuando no encuentra; el controller maneja el 404

import { CreateConcessionDto, UpdateConcessionDto, ConcessionItem, PaginatedResponse, PaginationParams } from '../types';
import * as repo from '../repositories/concessions.repository';

export async function findAll(params: PaginationParams): Promise<PaginatedResponse<ConcessionItem>> {
    const { page, limit } = params;
    const all = await repo.findAll();
    const start = (page - 1) * limit;
    const data = all.slice(start, start + limit);
    return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<ConcessionItem | undefined> {
    return repo.findById(id);
}

export async function create(dto: CreateConcessionDto): Promise<ConcessionItem> {
    return repo.create(dto);
}

export async function update(id: number, dto: UpdateConcessionDto): Promise<ConcessionItem | undefined> {
    const exists = await repo.findById(id);
    if (!exists) return undefined;
    return repo.update(id, dto);
}

export async function remove(id: number): Promise<boolean> {
    const exists = await repo.findById(id);
    if (!exists) return false;
    return repo.remove(id);
}