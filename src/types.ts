// ============================================
// TYPES — Producto de las concesiones del estadio
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

export interface SingleResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ValidationErrorResponse {
  error: string;
  message: string;
  issues: Array<{ field: string; message: string }>;
}

export interface ErrorResponse {
  error: string;
  message: string;
  stack?: string;
}
