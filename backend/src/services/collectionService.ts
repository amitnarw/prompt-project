import prisma from '../utils/prisma.js';
import type { CreateCollectionInput, UpdateCollectionInput } from '../types/index.js';

export class CollectionService {
  async create(userId: string, input: CreateCollectionInput) {
    const collection = await prisma.collection.create({
      data: {
        userId,
        name: input.name,
        description: input.description,
      },
    });
    return collection;
  }

  async update(id: string, userId: string, input: UpdateCollectionInput) {
    const existing = await prisma.collection.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Collection not found');
    }

    if (existing.userId !== userId) {
      throw new Error('Not authorized to update this collection');
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        name: input.name ?? existing.name,
        description: input.description ?? existing.description,
      },
    });

    return collection;
  }

  async delete(id: string, userId: string) {
    const existing = await prisma.collection.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Collection not found');
    }

    if (existing.userId !== userId) {
      throw new Error('Not authorized to delete this collection');
    }

    await prisma.collection.delete({ where: { id } });
    return { deleted: true };
  }

  async getById(id: string, userId: string) {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        prompts: {
          include: {
            prompt: {
              include: {
                versions: { orderBy: { createdAt: 'desc' }, take: 1 },
              },
            },
          },
          orderBy: { addedAt: 'desc' },
        },
      },
    });

    if (!collection) {
      throw new Error('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new Error('Not authorized to view this collection');
    }

    return collection;
  }

  async getUserCollections(userId: string) {
    return prisma.collection.findMany({
      where: { userId },
      include: {
        _count: { select: { prompts: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async addPrompt(collectionId: string, promptId: string, userId: string) {
    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection) throw new Error('Collection not found');
    if (collection.userId !== userId) throw new Error('Not authorized');

    const prompt = await prisma.prompt.findUnique({ where: { id: promptId } });
    if (!prompt) throw new Error('Prompt not found');

    const existing = await prisma.collectionPrompt.findUnique({
      where: { collectionId_promptId: { collectionId, promptId } },
    });
    if (existing) throw new Error('Prompt already in collection');

    const result = await prisma.collectionPrompt.create({
      data: { collectionId, promptId },
    });

    await prisma.collection.update({
      where: { id: collectionId },
      data: { updatedAt: new Date() },
    });

    return result;
  }

  async removePrompt(collectionId: string, promptId: string, userId: string) {
    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection) throw new Error('Collection not found');
    if (collection.userId !== userId) throw new Error('Not authorized');

    await prisma.collectionPrompt.delete({
      where: { collectionId_promptId: { collectionId, promptId } },
    });

    await prisma.collection.update({
      where: { id: collectionId },
      data: { updatedAt: new Date() },
    });

    return { removed: true };
  }
}

export const collectionService = new CollectionService();
