import { prisma } from './prisma';

export async function seedPlans() {
  console.log('Seeding plans...');

  const plans = [
    {
      name: 'Free',
      description: 'Free tier with basic features',
      price: 0,
      features: {
        promptsPerDay: 10,
        playgroundAccess: false,
        prioritySupport: false,
      },
    },
    {
      name: 'Pro',
      description: 'Pro tier for power users',
      price: 29,
      features: {
        promptsPerDay: -1, // unlimited
        playgroundAccess: true,
        prioritySupport: false,
      },
    },
    {
      name: 'Enterprise',
      description: 'Enterprise tier with all features',
      price: 99,
      features: {
        promptsPerDay: -1,
        playgroundAccess: true,
        prioritySupport: true,
      },
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {},
      create: {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        features: plan.features,
      },
    });
  }

  console.log('Created plans:', plans.map(p => p.name));
}
