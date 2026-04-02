import prisma from '../utils/prisma.js';
import { VoteType } from '@prisma/client';

export class VoteService {
  async upvote(promptId: string, userId: string) {
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
      if (existingVote.type === VoteType.UP) {
        await prisma.prompt.update({
          where: { id: promptId },
          data: { upvotes: { decrement: 1 } },
        });

        await prisma.vote.delete({
          where: { id: existingVote.id },
        });

        const updated = await prisma.prompt.findUnique({
          where: { id: promptId },
          select: { upvotes: true },
        });
        return { action: 'removed', newVoteCount: updated?.upvotes ?? 0 };
      }

      if (existingVote.type === VoteType.DOWN) {
        await prisma.prompt.update({
          where: { id: promptId },
          data: {
            upvotes: { increment: 1 },
            downvotes: { decrement: 1 },
          },
        });

        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type: VoteType.UP },
        });

        const updated = await prisma.prompt.findUnique({
          where: { id: promptId },
          select: { upvotes: true },
        });
        return { action: 'changed', newVoteCount: updated?.upvotes ?? 0 };
      }
    }

    await prisma.prompt.update({
      where: { id: promptId },
      data: { upvotes: { increment: 1 } },
    });

    await prisma.vote.create({
      data: {
        promptId,
        userId,
        type: VoteType.UP,
      },
    });

    const updated = await prisma.prompt.findUnique({
      where: { id: promptId },
      select: { upvotes: true },
    });
    return { action: 'added', newVoteCount: updated?.upvotes ?? 0 };
  }

  async downvote(promptId: string, userId: string) {
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
      if (existingVote.type === VoteType.DOWN) {
        await prisma.prompt.update({
          where: { id: promptId },
          data: { downvotes: { decrement: 1 } },
        });

        await prisma.vote.delete({
          where: { id: existingVote.id },
        });

        const updated = await prisma.prompt.findUnique({
          where: { id: promptId },
          select: { downvotes: true },
        });
        return { action: 'removed', newVoteCount: updated?.downvotes ?? 0 };
      }

      if (existingVote.type === VoteType.UP) {
        await prisma.prompt.update({
          where: { id: promptId },
          data: {
            upvotes: { decrement: 1 },
            downvotes: { increment: 1 },
          },
        });

        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type: VoteType.DOWN },
        });

        const updated = await prisma.prompt.findUnique({
          where: { id: promptId },
          select: { downvotes: true },
        });
        return { action: 'changed', newVoteCount: updated?.downvotes ?? 0 };
      }
    }

    await prisma.prompt.update({
      where: { id: promptId },
      data: { downvotes: { increment: 1 } },
    });

    await prisma.vote.create({
      data: {
        promptId,
        userId,
        type: VoteType.DOWN,
      },
    });

    const updated = await prisma.prompt.findUnique({
      where: { id: promptId },
      select: { downvotes: true },
    });
    return { action: 'added', newVoteCount: updated?.downvotes ?? 0 };
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
