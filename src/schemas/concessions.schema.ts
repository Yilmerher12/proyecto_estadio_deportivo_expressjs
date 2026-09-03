// src/schemas/concessions.schema.ts — Validación Zod para las concesiones del estadio
import { z } from 'zod';

// Campos base sin defaults, compartidos entre create y update.
// (ver semana 04: .partial() sobre un schema con .default() sigue aplicando
// el default a los campos ausentes, así que los defaults solo van en create)
const concessionFields = {
  name: z.string({ error: 'name es obligatorio' }).min(1, 'name no puede estar vacío').max(120).trim(),
  description: z.string({ error: 'description es obligatorio' }).min(1, 'description no puede estar vacío').trim(),
  sku: z
    .string({ error: 'sku es obligatorio' })
    .min(3, 'sku debe tener al menos 3 caracteres')
    .max(30)
    .trim(),
  price: z.number({ error: 'price es obligatorio' }).positive('price debe ser mayor a 0'),
  stock: z.number().int().nonnegative('stock no puede ser negativo'),
  available: z.boolean(),
  categoryId: z.string({ error: 'categoryId es obligatorio' }).uuid('categoryId debe ser un UUID válido'),
};

export const createConcessionSchema = z.object({
  ...concessionFields,
  stock: concessionFields.stock.default(0),
  available: concessionFields.available.default(true),
});

export const updateConcessionSchema = z.object(concessionFields).partial();

export type CreateConcessionDto = z.infer<typeof createConcessionSchema>;
export type UpdateConcessionDto = z.infer<typeof updateConcessionSchema>;
