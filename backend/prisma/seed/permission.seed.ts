import { prisma } from './prisma';

export async function seedPermissions() {
  console.log('Seeding permissions...');

  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  const userRole = await prisma.role.findUnique({ where: { name: 'user' } });

  if (!adminRole || !userRole) {
    throw new Error('Roles not found. Run role.seed.ts first.');
  }

  const allModules = await prisma.module.findMany();

  // Assign all permissions to admin role
  for (const mod of allModules) {
    await prisma.permission.upsert({
      where: { roleId_moduleId: { roleId: adminRole.id, moduleId: mod.id } },
      update: {},
      create: {
        roleId: adminRole.id,
        moduleId: mod.id,
        canReadList: true,
        canReadSingle: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true,
      },
    });
  }

  // Assign basic permissions to user role
  const userModuleNames = ['prompt', 'playground', 'vote', 'plan'];
  for (const modName of userModuleNames) {
    const mod = allModules.find(m => m.name === modName);
    if (mod) {
      await prisma.permission.upsert({
        where: { roleId_moduleId: { roleId: userRole.id, moduleId: mod.id } },
        update: {},
        create: {
          roleId: userRole.id,
          moduleId: mod.id,
          canReadList: true,
          canReadSingle: true,
          canCreate: true,
          canUpdate: modName === 'prompt',
          canDelete: modName === 'prompt',
        },
      });
    }
  }

  console.log('Permissions seeded');
}
