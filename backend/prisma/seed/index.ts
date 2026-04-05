import { prisma } from './prisma';
import { seedRoles } from './role.seed';
import { seedModules } from './module.seed';
import { seedPermissions } from './permission.seed';
import { seedPlans } from './plan.seed';
import { seedPrompts } from './prompt.seed';

async function main() {
  console.log('Seeding database...');

  await seedRoles();
  await seedModules();
  await seedPermissions();
  await seedPlans();
  await seedPrompts();

  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
