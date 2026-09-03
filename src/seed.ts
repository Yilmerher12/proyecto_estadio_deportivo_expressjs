// ============================================
// SEED — Datos iniciales del dominio (Estadio Deportivo - Concesiones)
// ============================================

import 'dotenv/config';
import { connectDB, disconnectDB } from './lib/mongoose';
import { Category } from './models/category.model';
import { Concession } from './models/concession.model';

async function seed(): Promise<void> {
  await connectDB();

  // Idempotencia: se limpia primero la principal (por la FK) y luego la secundaria
  await Concession.deleteMany({});
  await Category.deleteMany({});
  console.log('Collections cleared');

  const [drinks, food, snacks] = await Category.insertMany([
    { name: 'Bebidas', description: 'Gaseosas, cervezas y bebidas frías' },
    { name: 'Comida', description: 'Platillos típicos y comida rápida' },
    { name: 'Snacks', description: 'Productos empacados y pasabocas' },
  ]);
  console.log('Categories inserted');

  await Concession.insertMany([
    { name: 'Coca Cola 500ml', description: 'A cold refreshing coke drink.', sku: 'BEB-001', price: 3.99, stock: 5, available: true, category: drinks!._id },
    { name: 'Cerveza Águila 330ml', description: 'Ice-cold national lager beer in a can.', sku: 'BEB-002', price: 5000, stock: 40, available: true, category: drinks!._id },
    { name: 'Gaseosa Postobón 400ml', description: 'Ice-cold soda available in Apple or Colombiana flavors.', sku: 'BEB-003', price: 3500, stock: 30, available: true, category: drinks!._id },
    { name: 'Agua Mineral 500ml', description: 'Purified still bottled water.', sku: 'BEB-004', price: 2500, stock: 50, available: true, category: drinks!._id },
    { name: 'Empanada de Carne', description: 'Crispy fried empanada stuffed with shredded beef and potatoes.', sku: 'FOD-001', price: 3500, stock: 25, available: true, category: food!._id },
    { name: 'Lechona Tolimense', description: 'Traditional slow-roasted pork served with yellow peas and a plain corn cake.', sku: 'FOD-002', price: 12000, stock: 15, available: true, category: food!._id },
    { name: 'Papa Rellena', description: 'Fried mashed potato ball stuffed with seasoned beef, rice, and boiled egg.', sku: 'FOD-003', price: 4000, stock: 20, available: true, category: food!._id },
    { name: 'Chorizo con Arepa', description: 'Grilled pork sausage served with a white corn cake.', sku: 'FOD-004', price: 6000, stock: 18, available: true, category: food!._id },
    { name: 'Papas Criollas', description: 'Deep-fried golden small potatoes seasoned with salt.', sku: 'SNK-001', price: 3000, stock: 35, available: true, category: snacks!._id },
    { name: 'Maní Salado', description: 'Salted peanuts served in a small paper cone.', sku: 'SNK-002', price: 2000, stock: 45, available: true, category: snacks!._id },
  ]);
  console.log('Concessions inserted');

  console.log('Seed completed successfully');
  await disconnectDB();
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
