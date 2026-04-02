import prisma from '../utils/prisma.js';
import {
  CreatePromptInput,
  UpdatePromptInput,
  PaginationQuery,
} from '../types/index.js';

export class PromptService {
  async findAll(query: PaginationQuery) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (query.category) {
      where.category = query.category;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [prompts, total] = await Promise.all([
      prisma.prompt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          versions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.prompt.count({ where }),
    ]);

    return {
      prompts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!prompt) {
      throw new Error('Prompt not found');
    }

    return prompt;
  }

  async create(input: CreatePromptInput) {
    const prompt = await prisma.prompt.create({
      data: {
        title: input.title,
        description: input.description,
        content: input.content,
        category: input.category,
        tags: input.tags,
        createdBy: input.createdBy || 'anonymous',
      },
    });

    return prompt;
  }

  async update(id: string, input: UpdatePromptInput) {
    const existingPrompt = await prisma.prompt.findUnique({
      where: { id },
    });

    if (!existingPrompt) {
      throw new Error('Prompt not found');
    }

    if (input.content && input.content !== existingPrompt.content) {
      await prisma.promptVersion.create({
        data: {
          promptId: id,
          content: existingPrompt.content,
        },
      });
    }

    const prompt = await prisma.prompt.update({
      where: { id },
      data: {
        title: input.title ?? existingPrompt.title,
        description: input.description ?? existingPrompt.description,
        content: input.content ?? existingPrompt.content,
        category: input.category ?? existingPrompt.category,
        tags: input.tags ?? existingPrompt.tags,
      },
    });

    return prompt;
  }

  async delete(id: string) {
    const existingPrompt = await prisma.prompt.findUnique({
      where: { id },
    });

    if (!existingPrompt) {
      throw new Error('Prompt not found');
    }

    await prisma.prompt.delete({
      where: { id },
    });

    return { deleted: true };
  }

  async fork(id: string, userId: string) {
    const existingPrompt = await prisma.prompt.findUnique({
      where: { id },
    });

    if (!existingPrompt) {
      throw new Error('Prompt not found');
    }

    const forkedPrompt = await prisma.prompt.create({
      data: {
        title: `${existingPrompt.title} (Fork)`,
        description: existingPrompt.description,
        content: existingPrompt.content,
        category: existingPrompt.category,
        tags: existingPrompt.tags,
        createdBy: userId,
        forkedFrom: id,
      },
    });

    return forkedPrompt;
  }

  async getVersions(promptId: string) {
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) {
      throw new Error('Prompt not found');
    }

    const versions = await prisma.promptVersion.findMany({
      where: { promptId },
      orderBy: { createdAt: 'desc' },
    });

    return versions;
  }
}

export const promptService = new PromptService();
