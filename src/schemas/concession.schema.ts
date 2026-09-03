// ============================================
// SCHEMA ZOD: Concession (con ref a Category)
// ============================================

import { z } from 'zod';

// ObjectId de Mongo: 24 caracteres hexadecimales
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = z.string().regex(objectIdRegex, 'ID inválido');

// Campos base sin defaults, compartidos entre create y update.
// (ver semana 04/05: .partial() sobre un schema con .default() sigue aplicando
// el default a los campos ausentes, así que los defaults solo van en create)
const concessionFields = {
  name: z.string().min(1, 'El nombre es requerido').max(150),
  description: z.string().min(1, 'La descripción es requerida').max(500),
  sku: z.string().min(3, 'El SKU debe tener al menos 3 caracteres').max(30),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  stock: z.number().int().nonnegative('El stock no puede ser negativo'),
  available: z.boolean(),
  category: objectIdSchema,
};

export const createConcessionSchema = z.object({
  ...concessionFields,
  stock: concessionFields.stock.default(0),
  available: concessionFields.available.default(true),
});

export const updateConcessionSchema = z.object(concessionFields).partial();

export type CreateConcessionDto = z.infer<typeof createConcessionSchema>;
export type UpdateConcessionDto = z.infer<typeof updateConcessionSchema>;
