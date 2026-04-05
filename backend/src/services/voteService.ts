import prisma from '../utils/prisma.js';
import { VoteType } from '../../prisma/generated/prisma/client';

export class VoteService {
  async markWorks(promptId: string, userId: string) {
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) {
      throw new Error('Prompt not found');
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        promptId_userId: {
          promptId,
          userId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.type === VoteType.WORKS) {
        await prisma.prompt.update({
          where: { id: promptId },
          data: { worksCount: { decrement: 1 } },
        });

        await prisma.vote.delete({
          where: { id: existingVote.id },
        });

        const updated = await prisma.prompt.findUnique({
          where: { id: promptId },
          select: { worksCount: true },
        });
        return { action: 'removed', newVoteCount: updated?.worksCount ?? 0 };
      }

      if (existingVote.type === VoteType.DOESNT_WORK) {
        await prisma.prompt.update({
          where: { id: promptId },
          data: {
            worksCount: { increment: 1 },
            doesntWorkCount: { decrement: 1 },
          },
        });

        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type: VoteType.WORKS },
        });

        const updated = await prisma.prompt.findUnique({
          where: { id: promptId },
          select: { worksCount: true },
        });
        return { action: 'changed', newVoteCount: updated?.worksCount ?? 0 };
      }
    }

    await prisma.prompt.update({
      where: { id: promptId },
      data: { worksCount: { increment: 1 } },
    });

    await prisma.vote.create({
      data: {
        promptId,
        userId,
        type: VoteType.WORKS,
      },
    });

    const updated = await prisma.prompt.findUnique({
      where: { id: promptId },
      select: { worksCount: true },
    });
    return { action: 'added', newVoteCount: updated?.worksCount ?? 0 };
  }

  async markDoesntWork(promptId: string, userId: string) {
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) {
      throw new Error('Prompt not found');
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        promptId_userId: {
          promptId,
          userId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.type === VoteType.DOESNT_WORK) {
        await prisma.prompt.update({
          where: { id: promptId },
          data: { doesntWorkCount: { decrement: 1 } },
        });

        await prisma.vote.delete({
          where: { id: existingVote.id },
        });

        const updated = await prisma.prompt.findUnique({
          where: { id: promptId },
          select: { doesntWorkCount: true },
        });
        return { action: 'removed', newVoteCount: updated?.doesntWorkCount ?? 0 };
      }

      if (existingVote.type === VoteType.WORKS) {
        await prisma.prompt.update({
          where: { id: promptId },
          data: {
            worksCount: { decrement: 1 },
            doesntWorkCount: { increment: 1 },
          },
        });

        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type: VoteType.DOESNT_WORK },
        });

        const updated = await prisma.prompt.findUnique({
          where: { id: promptId },
          select: { doesntWorkCount: true },
        });
        return { action: 'changed', newVoteCount: updated?.doesntWorkCount ?? 0 };
      }
    }

    await prisma.prompt.update({
      where: { id: promptId },
      data: { doesntWorkCount: { increment: 1 } },
    });

    await prisma.vote.create({
      data: {
        promptId,
        userId,
        type: VoteType.DOESNT_WORK,
      },
    });

    const updated = await prisma.prompt.findUnique({
      where: { id: promptId },
      select: { doesntWorkCount: true },
    });
    return { action: 'added', newVoteCount: updated?.doesntWorkCount ?? 0 };
  }

  async getUserVote(promptId: string, userId: string) {
    const vote = await prisma.vote.findUnique({
      where: {
        promptId_userId: {
          promptId,
          userId,
        },
      },
    });

    return vote?.type || null;
  }
}

export const voteService = new VoteService();
