// ============================================
// TYPES: Interfaz del recurso principal
// ============================================
// Adapta los campos de Item a tu dominio asignado.
//
// Ejemplos por dominio:
// - Biblioteca:   title: string; author: string; isbn: string; year: number;
// - Farmacia:     name: string; price: number; stock: number; category: string;
// - Gimnasio:     name: string; plan: string; memberSince: string;
// - Restaurante:  name: string; price: number; category: string; available: boolean;
// - Hotel:        roomNumber: string; type: string; pricePerNight: number; available: boolean;

export interface ConcessionItem {
    id: number;
    name: string;
    description?: string;
    type: string;
    price: number;
    stock: number;
    available: boolean;
}

// DTO usado para crear un nuevo item (sin id, se genera automáticamente)
export type CreateItemDto = Omit<ConcessionItem, 'id'>;

// DTO para actualización (todos los campos editables)
export type UpdateItemDto = Partial<CreateItemDto>;