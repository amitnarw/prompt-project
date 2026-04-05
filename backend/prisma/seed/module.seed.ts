import { prisma } from './prisma';

const modules = ['prompt', 'playground', 'vote', 'user', 'admin', 'plan'];

export async function seedModules() {
  console.log('Seeding modules...');

  for (const moduleName of modules) {
    await prisma.module.upsert({
      where: { name: moduleName },
      update: {},
      create: { name: moduleName },
    });
  }

  console.log('Created modules:', modules);

  return modules;
}

export { modules };
