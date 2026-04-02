import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: { name: "user" },
  });

  console.log("Created roles:", { adminRole, userRole });

  // Create default modules
  const modules = [
    "prompt",
    "playground",
    "vote",
    "user",
    "admin",
    "plan",
  ];

  for (const moduleName of modules) {
    await prisma.module.upsert({
      where: { name: moduleName },
      update: {},
      create: { name: moduleName },
    });
  }

  console.log("Created modules:", modules);

  // Assign all permissions to admin role
  const allModules = await prisma.module.findMany();
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
  const userModules = ["prompt", "playground", "vote", "plan"];
  for (const modName of userModules) {
    const mod = allModules.find((m) => m.name === modName);
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
          canUpdate: modName === "prompt" ? true : false,
          canDelete: modName === "prompt" ? true : false,
        },
      });
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
