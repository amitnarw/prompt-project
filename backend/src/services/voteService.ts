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

        return { action: 'removed', newVoteCount: prompt.upvotes - 1 };
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

        return { action: 'changed', newVoteCount: prompt.upvotes + 1 };
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

    return { action: 'added', newVoteCount: prompt.upvotes + 1 };
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

        return { action: 'removed', newVoteCount: prompt.downvotes - 1 };
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

        return { action: 'changed', newVoteCount: prompt.downvotes + 1 };
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

    return { action: 'added', newVoteCount: prompt.downvotes + 1 };
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
