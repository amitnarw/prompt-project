import prisma from '../utils/prisma.js';

export class BookmarkService {
  async addBookmark(userId: string, promptId: string) {
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) {
      throw new Error('Prompt not found');
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_promptId: { userId, promptId },
      },
    });

    if (existing) {
      throw new Error('Prompt already bookmarked');
    }

    const bookmark = await prisma.bookmark.create({
      data: { userId, promptId },
    });

    return bookmark;
  }

  async removeBookmark(userId: string, promptId: string) {
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_promptId: { userId, promptId },
      },
    });

    if (!existing) {
      throw new Error('Bookmark not found');
    }

    await prisma.bookmark.delete({
      where: { id: existing.id },
    });

    return { deleted: true };
  }

  async getUserBookmarks(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId },
        include: {
          prompt: {
            include: {
              versions: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.bookmark.count({ where: { userId } }),
    ]);

    return {
      bookmarks: bookmarks.map(b => b.prompt),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async isBookmarked(userId: string, promptId: string): Promise<boolean> {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_promptId: { userId, promptId },
      },
    });
    return !!bookmark;
  }

  async getUserBookmarkIds(userId: string, promptIds: string[]): Promise<Set<string>> {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId, promptId: { in: promptIds } },
      select: { promptId: true },
    });
    return new Set(bookmarks.map(b => b.promptId));
  }
}

export const bookmarkService = new BookmarkService();
