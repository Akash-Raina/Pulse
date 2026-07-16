import { ROLE_RANKING } from "../constants/member-role.js";
import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";
import type { createChannelInput } from "../types/channel.types.js";
import { ensureServerAccess } from "./permission.service.js";

export async function createChannel(data: createChannelInput) {
  const { userId, serverId, userInput } = data;
  const { name, type, minimumRole } = userInput;

  const member = await ensureServerAccess(userId, serverId);

  if (ROLE_RANKING[member.role] < ROLE_RANKING["MODERATOR"])
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

export async function getChannels(serverId: string, userId: string) {
  const member = await ensureServerAccess(userId, serverId);

  const channels = await prisma.channel.findMany({
    where: {
      serverId,
    },
  });

  const accessibleChannels = channels.filter(
    (channel) => ROLE_RANKING[member.role] >= ROLE_RANKING[channel.minimumRole],
  );

  return accessibleChannels;
}
