// prisma/seed.ts — Datos iniciales del dominio (Estadio Deportivo - Concesiones)
// Ejecutar con: pnpm dlx prisma db seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed...');

  // Idempotencia: se limpia primero el recurso principal (por la FK) y luego el secundario
  await prisma.concession.deleteMany();
  await prisma.category.deleteMany();

  const [drinks, food, snacks] = await Promise.all([
    prisma.category.create({ data: { name: 'Bebidas', description: 'Gaseosas, cervezas y bebidas frías' } }),
    prisma.category.create({ data: { name: 'Comida', description: 'Platillos típicos y comida rápida' } }),
    prisma.category.create({ data: { name: 'Snacks', description: 'Productos empacados y pasabocas' } }),
  ]);

  const result = await prisma.concession.createMany({
    data: [
      { name: 'Coca Cola 500ml', description: 'A cold refreshing coke drink.', sku: 'BEB-001', price: 3.99, stock: 5, available: true, categoryId: drinks.id },
      { name: 'Cerveza Águila 330ml', description: 'Ice-cold national lager beer in a can.', sku: 'BEB-002', price: 5000, stock: 40, available: true, categoryId: drinks.id },
      { name: 'Gaseosa Postobón 400ml', description: 'Ice-cold soda available in Apple or Colombiana flavors.', sku: 'BEB-003', price: 3500, stock: 30, available: true, categoryId: drinks.id },
      { name: 'Agua Mineral 500ml', description: 'Purified still bottled water.', sku: 'BEB-004', price: 2500, stock: 50, available: true, categoryId: drinks.id },
      { name: 'Empanada de Carne', description: 'Crispy fried empanada stuffed with shredded beef and potatoes.', sku: 'FOD-001', price: 3500, stock: 25, available: true, categoryId: food.id },
      { name: 'Lechona Tolimense', description: 'Traditional slow-roasted pork served with yellow peas and a plain corn cake.', sku: 'FOD-002', price: 12000, stock: 15, available: true, categoryId: food.id },
      { name: 'Papa Rellena', description: 'Fried mashed potato ball stuffed with seasoned beef, rice, and boiled egg.', sku: 'FOD-003', price: 4000, stock: 20, available: true, categoryId: food.id },
      { name: 'Chorizo con Arepa', description: 'Grilled pork sausage served with a white corn cake.', sku: 'FOD-004', price: 6000, stock: 18, available: true, categoryId: food.id },
      { name: 'Papas Criollas', description: 'Deep-fried golden small potatoes seasoned with salt.', sku: 'SNK-001', price: 3000, stock: 35, available: true, categoryId: snacks.id },
      { name: 'Maní Salado', description: 'Salted peanuts served in a small paper cone.', sku: 'SNK-002', price: 2000, stock: 45, available: true, categoryId: snacks.id },
    ],
  });

  console.log(`✅ ${result.count} concesiones creadas en 3 categorías`);
}

main()
  .catch((err: unknown) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
