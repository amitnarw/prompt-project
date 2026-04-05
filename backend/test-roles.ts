import 'dotenv/config';
import { prismaClient } from './src/lib/prismaClient.js';

async function main() {
  try {
    const roles = await prismaClient.role.findMany();
    console.log('Roles:', JSON.stringify(roles, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prismaClient.$disconnect();
  }
}

main();
