// ============================================
// MODELO: Concession (entidad principal, con referencia a Category)
// Producto vendido en las concesiones del estadio
// ============================================

import { Schema, model, Types } from 'mongoose';

export interface IConcession {
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  available: boolean;
  category: Types.ObjectId;
}

const concessionSchema = new Schema<IConcession>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true,
      maxlength: 500,
    },
    sku: {
      type: String,
      required: [true, 'El SKU es requerido'],
      trim: true,
      uppercase: true,
      unique: true,
      maxlength: 30,
    },
    price: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'El stock no puede ser negativo'],
    },
    available: {
      type: Boolean,
      default: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'La categoría es requerida'],
    },
  },
  { timestamps: true },
);

export const Concession = model<IConcession>('Concession', concessionSchema);
