import type { CreatePromptInput, UpdatePromptInput } from '@/types/index.js';
import prisma from '../utils/prisma.js';

interface PromptQueryParams {
  page?: string;
  limit?: string;
  category?: string;
  search?: string;
  tags?: string;
  sortBy?: string;
  isVerified?: string;
  modelType?: string;
  bookmarkedBy?: string;
  collectionId?: string;
  minWorksCount?: number;
  maxWorksCount?: number;
  minDoesntWorkCount?: number;
  maxDoesntWorkCount?: number;
}

export class PromptService {
  async findAll(query: PromptQueryParams) {
    const page = parseInt(String(query.page || '1'), 10);
    const limit = parseInt(String(query.limit || '10'), 10);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    // Category filter
    if (query.category) {
      where.category = query.category;
    }

    // Search filter
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // Verified filter
    if (query.isVerified !== undefined) {
      where.isVerified = query.isVerified === 'true' || query.isVerified === '1';
    }

    // Model type filter
    if (query.modelType) {
      where.modelType = query.modelType;
    }

    // Tag filter (all specified tags must be present)
    if (query.tags) {
      const tagsArray = query.tags.split(',').map(t => t.trim()).filter(Boolean);
      if (tagsArray.length > 0) {
        where.tags = { hasEvery: tagsArray };
      }
    }

    // Works count range
    if (query.minWorksCount !== undefined || query.maxWorksCount !== undefined) {
      where.worksCount = {};
      if (query.minWorksCount !== undefined) {
        (where.worksCount as Record<string, number>).gte = query.minWorksCount;
      }
      if (query.maxWorksCount !== undefined) {
        (where.worksCount as Record<string, number>).lte = query.maxWorksCount;
      }
    }

    // Doesnt work count range
    if (query.minDoesntWorkCount !== undefined || query.maxDoesntWorkCount !== undefined) {
      where.doesntWorkCount = {};
      if (query.minDoesntWorkCount !== undefined) {
        (where.doesntWorkCount as Record<string, number>).gte = query.minDoesntWorkCount;
      }
      if (query.maxDoesntWorkCount !== undefined) {
        (where.doesntWorkCount as Record<string, number>).lte = query.maxDoesntWorkCount;
      }
    }

    // Bookmark filter
    if (query.bookmarkedBy) {
      where.bookmarks = { some: { userId: query.bookmarkedBy } };
    }

    // Collection filter
    if (query.collectionId) {
      where.collections = { some: { collectionId: query.collectionId } };
    }

    // Sorting
    let orderBy: Record<string, string> = { createdAt: 'desc' };
    switch (query.sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'mostWorks':
        orderBy = { worksCount: 'desc' };
        break;
      case 'mostDoesntWork':
        orderBy = { doesntWorkCount: 'desc' };
        break;
      case 'alphabetical':
        orderBy = { title: 'asc' };
        break;
      case 'rating':
        orderBy = { worksCount: 'desc' };
        break;
      // 'newest' is default
    }

    const [prompts, total] = await Promise.all([
      prisma.prompt.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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

  async verifyPrompt(id: string, verifiedBy: string) {
    const prompt = await prisma.prompt.findUnique({ where: { id } });
    if (!prompt) throw new Error('Prompt not found');

    return prisma.prompt.update({
      where: { id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy,
      },
    });
  }

  async unverifyPrompt(id: string) {
    return prisma.prompt.update({
      where: { id },
      data: {
        isVerified: false,
        verifiedAt: null,
        verifiedBy: null,
      },
    });
  }

  async incrementUsageCount(id: string) {
    return prisma.prompt.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    });
  }

  async checkAndAutoVerify(id: string): Promise<boolean> {
    const prompt = await prisma.prompt.findUnique({ where: { id } });
    if (!prompt || prompt.isVerified) return false;

    // Auto-verify if worksCount > 10 and doesntWorkCount ratio < 0.2
    if (prompt.worksCount > 10) {
      const totalVotes = prompt.worksCount + prompt.doesntWorkCount;
      const ratio = totalVotes > 0 ? prompt.doesntWorkCount / totalVotes : 0;
      if (ratio < 0.2) {
        await this.verifyPrompt(id, 'auto');
        return true;
      }
    }
    return false;
  }
}

export const promptService = new PromptService();
