import { prisma } from './prisma';

export async function seedRoles() {
  console.log('Seeding roles...');

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' },
  });

  console.log('Created roles:', { adminRole, userRole });

  return { adminRole, userRole };
}
