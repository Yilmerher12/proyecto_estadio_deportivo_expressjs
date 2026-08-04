import type { ConcessionItem, CreateItemDto, UpdateItemDto } from './types.js';

// Store en memoria — simula una base de datos sin persistencia
// Los datos se pierden al reiniciar el servidor (se usará BD a partir de week-05)
const products: ConcessionItem[] = [
    {id: 1, name: 'Coke', description: 'Soda cold drink', type: 'drink', price: 2500, stock: 100, available: true},
    {id: 2, name: 'Fries', description: 'potato fries', type: 'food', price: 2000, stock: 50, available: true},
    {id: 3, name: 'Hot dog', description: 'A cooked sausage inside a slice of long bread', type: 'food', price: 5000, stock: 30, available: true},
    {id: 4, name: 'Chicken Burger', description: 'A crispy chicken fry served between two slices of bread with fresh tomato and lettuce.', type: 'food', price: 22000, stock: 50, available: true},
];
let nextId = 5;

// TODO: Implementar getAll
// Debe retornar todos los ítems del array
export function getAll(): ConcessionItem[] {
    // TODO: retornar el array de items
    return products;
}

// TODO: Implementar getById
// Debe retornar el ítem con el id dado, o undefined si no existe
export function getById(id: number): ConcessionItem | undefined {
    // TODO: buscar y retornar el ítem
    return products.find(product => product.id === id);
}

// TODO: Implementar create
// Debe crear un nuevo ítem con un id autoincremental y retornarlo
export function create(data: CreateItemDto): ConcessionItem {
    // TODO: crear, guardar y retornar el nuevo ítem
    // Pista: usa nextId++ para generar el id
    const newProduct: ConcessionItem = { id: nextId++, ...data };
    products.push(newProduct);
    return newProduct;
}

// TODO: Implementar update
// Debe actualizar el ítem con el id dado y retornarlo, o undefined si no existe
export function update(id: number, data: UpdateItemDto): ConcessionItem | undefined {
    // TODO: buscar el ítem, actualizar sus campos y retornarlo
    const product = products.find((product) => product.id === id);
    if(!product) return undefined;
    
    Object.assign(product, data);
    return product;
}

// TODO: Implementar remove
// Debe eliminar el ítem con el id dado y retornar true, o false si no existe
export function remove(id: number): boolean {
    // TODO: buscar y eliminar el ítem, retornar éxito
    const index = products.findIndex((product) => product.id === id);
    if(index === -1)
        return false;
        products.splice(index, 1);
    return true;

}