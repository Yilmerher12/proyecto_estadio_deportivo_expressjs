// ============================================
// READER — Lee el archivo de datos JSON
// ============================================

import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Concessions } from './types.js';

// TODO: Implementar la función readItems
// Debe:
// 1. Construir la ruta al archivo data/items.json usando join() e import.meta.dirname
// 2. Leer el archivo con readFile (de 'fs/promises') usando 'utf-8'
// 3. Parsear el JSON y retornar el array de Item[]
// 4. Si ocurre un error, lanzar un Error descriptivo con el mensaje original
//
// Firma esperada:
// export async function readItems(): Promise<Item[]>
//
export async function readItems(): Promise<Concessions[]> {
    const filePath = join(import.meta.dirname, '..', 'data', 'items.json');
    try {
        const raw = await readFile(filePath, 'utf-8');
        return JSON.parse(raw) as Concessions[];
    } catch (err) {
        throw new Error(`Error al leer el archivo ${filePath}: ${err}, no se encontro!`);
    }
}