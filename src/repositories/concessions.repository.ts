// ============================================
// REPOSITORY — capa de acceso a datos (en memoria)
// ============================================
import { ConcessionItem } from '../types';

export type CreateProductRepoDto = Omit<ConcessionItem, 'id' | 'createdAt'>;
export type UpdateProductRepoDto = Partial<CreateProductRepoDto>;

let store: ConcessionItem[] = [
  {
    id: 1,
    name: 'Coke',
    description: 'Soda cold drink',
    type: 'drink',
    price: 2500,
    stock: 100,
    available: true
  },
  { 
    id: 2, 
    name: 'Fries', 
    description: 'potato fries', 
    type: 'food', 
    price: 2000, 
    stock: 50, 
    available: true 
  },
  { 
    id: 3, 
    name: 'Hot dog', 
    description: 'A cooked sausage inside a slice of long bread', 
    type: 'food', 
    price: 5000, 
    stock: 30, 
    available: true 
  },
  {
    id: 4, 
    name: 'Chicken Burger', 
    description: 'A crispy chicken fry served between two slices of bread with fresh tomato and lettuce.',
    type: 'food', 
    price: 22000, 
    stock: 50, 
    available: true
  },

];

let nextId = 5;

export async function findAll(): Promise<ConcessionItem[]> {
  return [...store];
}

export async function findById(id: number): Promise<ConcessionItem | undefined> {
  const product = store.find((p) => p.id === id);
  return product ? { ...product } : undefined;
}

export async function create(dto: CreateProductRepoDto): Promise<ConcessionItem> {
  const product: ConcessionItem = { id: nextId++, ...dto, createdAt: new Date().toISOString() };
  store.push(product);
  return { ...product };
}

export async function update(id: number, dto: UpdateProductRepoDto): Promise<ConcessionItem | undefined> {
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return undefined;

  store[index] = { ...store[index]!, ...dto };
  return { ...store[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return false;

  store.splice(index, 1);
  return true;
}
