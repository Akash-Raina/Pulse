import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";
import type { EditServerInput } from "../types/server.types.js";

export async function createServer(name: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const server = await tx.server.create({
      data: {
        name,
        ownerId: userId,
      },
      select: {
        name: true,
        icon: true,
        id: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await tx.member.create({
      data: {
        userId,
        serverId: server.id,
        role: "OWNER",
      },
    });

    return server;
  });
}

export async function getServers(userId: string) {
  const memberShips = await prisma.member.findMany({
    where: {
      userId,
    },
    include: {
      server: {
        select: {
          id: true,
          name: true,
          icon: true,
          ownerId: true,
        },
      },
    },
  });

  const servers = memberShips.map((member) => member.server);

  return servers;
}

export async function editServer(data: EditServerInput) {
  const { serverId, userId, name, icon } = data;

  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
    },
    select: {
      ownerId: true,
    },
  });

  if (!server) throw new AppError(404, "Server not found");

  if (server?.ownerId !== userId)
    throw new AppError(403, "Only server owner can edit the server");

  const updatedServer = await prisma.server.update({
    where: {
      id: serverId,
    },
    data: {
      name,
      icon
    }
  });

  return updatedServer;
}
