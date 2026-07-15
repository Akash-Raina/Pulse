import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";
import type { createChannelInput } from "../types/channel.types.js";

export async function createChannel(data: createChannelInput) {
  const { userId, serverId, userInput } = data;
  const { name, type, minimumRole } = userInput;

  const member = await prisma.member.findUnique({
    where: {
      userId_serverId: {
        userId,
        serverId,
      },
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!member) throw new AppError(403, "You are not a member of this server");

  const ranking = {
    MEMBER: 0,
    MODERATOR: 1,
    ADMIN: 2,
    OWNER: 3,
  };

  if (ranking[member.role] < ranking.MODERATOR)
    throw new AppError(403, "You don't have permission to create Channels");

  const existingChannel = await prisma.channel.findFirst({
    where: {
      serverId,
      name,
    },
  });

  if (existingChannel) {
    throw new AppError(409, "Channel already exists.");
  }

  const channel = await prisma.channel.create({
    data: {
      name,
      type,
      minimumRole,
      creatorId: userId,
      serverId,
    },
    select: {
      id: true,
      name: true,
      type: true,
      icon: true,
      serverId: true,
      minimumRole: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return channel;
}
