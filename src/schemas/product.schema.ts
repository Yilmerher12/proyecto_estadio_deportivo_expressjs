// ============================================
// SCHEMAS — Producto de las concesiones del estadio
// ============================================
import { z } from 'zod';

// Campos base sin defaults: se comparten entre create y update.
// Ojo: si el .default() se pusiera aquí y luego se hiciera .partial(),
// Zod sigue aplicando el default a los campos que faltan en el update
// (ej: un PUT que solo manda `stock` terminaría reseteando `description`
// a '' porque el campo "falta" en el body). Por eso los defaults solo
// se agregan en createProductSchema.
const productFields = {
  name: z.string({ error: 'name es obligatorio' }).min(1, 'name no puede estar vacío').trim(),
  description: z.string().trim(),
  price: z.number({ error: 'price es obligatorio' }).positive('price debe ser mayor a 0'),
  type: z
    .string({ error: 'type es obligatorio' })
    .min(1, 'type no puede estar vacío')
    .trim(),
  stock: z.number().int().nonnegative('stock no puede ser negativo'),
  available: z.boolean(),
};

export const createProductSchema = z.object({
  ...productFields,
  description: productFields.description.default(''),
  stock: productFields.stock.default(0),
  available: productFields.available.default(true),
});

export const updateProductSchema = z.object(productFields).partial();

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
