import mongoose, { Document, Schema } from 'mongoose';

// ============================================
// MODELO: Concession — producto de las concesiones del estadio
// ============================================

export interface IConcession extends Document {
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  available: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const ConcessionModel = mongoose.model<IConcession>('Concession', concessionSchema);
