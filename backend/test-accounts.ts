import 'dotenv/config';
import { prismaClient } from './src/lib/prismaClient.js';

async function main() {
  try {
    // Check if accounts table has the right columns
    const result = await prismaClient.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'account'`;
    console.log('Account columns:', JSON.stringify(result, null, 2));
    
    // Check users table
    const users = await prismaClient.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'user'`;
    console.log('User columns:', JSON.stringify(users, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prismaClient.$disconnect();
  }
}

main();
