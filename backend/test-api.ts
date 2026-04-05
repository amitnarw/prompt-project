import 'dotenv/config';
import { prismaClient } from './src/lib/prismaClient.js';

async function test() {
  console.log('Testing Prisma connection...');
  try {
    const count = await prismaClient.prompt.count();
    console.log('Prompt count:', count);
    const prompts = await prismaClient.prompt.findMany({
      take: 2
    });
    console.log('First 2 prompts:', JSON.stringify(prompts, null, 2));
  } catch (e: any) {
    console.error('Error:', e.message);
    console.error('Code:', e.code);
    console.error('Meta:', e.meta);
  }
}

test();