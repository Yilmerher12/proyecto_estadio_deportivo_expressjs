// ============================================
// TYPES — Estadio Deportivo: recurso de concesiones
// ============================================

export interface ConcessionItem {
    id: number;
    name: string;
    description: string;
    createdAt?: string;
    type: string;
    price: number;
    stock: number;
    available: boolean;
}

// DTO para crear — sin campos auto-generados
export type CreateConcessionDto = Omit<ConcessionItem, 'id' | 'createdAt'>;

// DTO para actualizar — todos los campos opcionales
export type UpdateConcessionDto = Partial<CreateConcessionDto>;

// Contratos de respuesta (no cambiar nombres — son genéricos)
export interface SingleResponse<T> {
    data: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface ErrorResponse {
    error: string;
    message: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}