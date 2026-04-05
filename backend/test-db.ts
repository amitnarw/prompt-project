import 'dotenv/config';
import { prismaClient } from './src/lib/prismaClient.js';

async function main() {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'set' : 'not set');
    const roles = await prismaClient.role.findMany();
    console.log('Roles:', JSON.stringify(roles));
  } catch (e) {
    console.error('DB Error:', e.message);
  } finally {
    await prismaClient.$disconnect();
  }
}

main();
