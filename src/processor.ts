// ============================================
// PROCESSOR — Filtra y calcula estadísticas
// ============================================

import type { Concessions, ItemSummary } from './types.js';

// TODO: Implementar filterByCategory
// Debe:
// 1. Si categoryFilter es null, retornar todos los items
// 2. Si categoryFilter está definido, retornar solo los items de esa categoría
//    (comparación case-insensitive con .toLowerCase())
// 3. Si no hay items en esa categoría, lanzar un Error que liste las categorías disponibles
//
// Firma esperada:
// export function filterByCategory(items: Item[], categoryFilter: string | null): Item[]

export function filterByCategory(items: Concessions[], categoryFilter: string | null): Concessions[] {
    if (categoryFilter === null) {
        return items;
    }
    const filtered = items.filter(item => item.type.toLowerCase() === categoryFilter.toLowerCase());
    if (filtered.length === 0) {
        const availableCategories = Array.from(new Set(items.map(item => item.type)));
        throw new Error(`Categoría no encontrada. Categorías disponibles: ${availableCategories.join(', ')}`);
    }
    return filtered;
}

// TODO: Implementar calculateSummary
// Debe calcular y retornar un objeto ItemSummary con:
// - total: longitud del array
// - active: items con active === true
// - inactive: items con active === false
// - averagePrice: precio promedio redondeado a 2 decimales
// - mostExpensive: item con el mayor precio
// - cheapest: item con el menor precio
// - categories: array de categorías únicas (sin repetición)
//
// Pistas:
// - Usa .reduce() para sumar precios
// - Usa .filter() para separar activos e inactivos
// - Usa new Set() + Array.from() para categorías únicas
// - Usa Math.max/min o sort para el más caro/barato
//
// Firma esperada:
// export function calculateSummary(items: Item[]): ItemSummary

export function calculateSummary(items: Concessions[]): ItemSummary {
    const total = items.length;
    const active = items.filter(item => item.available).length;
    const inactive = total - active;
    const averagePrice = total > 0 ? parseFloat((items.reduce((sum, item) => sum + item.price, 0) / total).toFixed(2)) : 0;
    const mostExpensive = items.reduce((prev, current) => (prev.price > current.price ? prev : current), items[0]);
    const cheapest = items.reduce((prev, current) => (prev.price < current.price ? prev : current), items[0]);
    const categories = Array.from(new Set(items.map(item => item.type)));
    return { total, active, inactive, averagePrice, mostExpensive, cheapest, categories };
}