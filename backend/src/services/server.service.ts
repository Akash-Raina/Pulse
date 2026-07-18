import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";
import type {
  EditServerInput,
  transferOwnershipInput,
} from "../types/server.types.js";
import { ensureServerAccess } from "./permission.service.js";

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
      icon,
    },
  });

  return updatedServer;
}

export async function transferOwnership(data: transferOwnershipInput) {
  const { userId, serverId, userInput } = data;
  const oldOwner = await ensureServerAccess(userId, serverId);

  if (oldOwner.role !== "OWNER")
    throw new AppError(403, "You don't have permission to transfer ownership");
  if (userInput.memberId === oldOwner.id)
    throw new AppError(400, "You are  already the owner");

  const owner = await prisma.$transaction(async (txn) => {
    const newOwner = await txn.member.findUnique({
      where: {
        id: userInput.memberId,
      },
      select: {
        id: true,
        userId: true,
        serverId: true,
      },
    });

    if (!newOwner) throw new AppError(404, "Member not found");

    if (newOwner.serverId !== serverId)
      throw new AppError(403, "Member does not belong to this server");

    const changeOwner = await txn.server.update({
      where: {
        id: serverId,
      },
      data: {
        ownerId: newOwner.userId,
      },
      select: {
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    await txn.member.update({
      where: {
        id: userInput.memberId,
      },
      data: {
        role: "OWNER",
      },
    });
    await txn.member.update({
      where: {
        id: oldOwner.id,
      },
      data: {
        role: userInput.oldOwnerRole,
      },
    });
    return changeOwner;
  });

  return owner;
}

export async function deleteServer(serverId: string, userId: string) {
  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
    },
    select: {
      ownerId: true,
    },
  });
  if (!server) throw new AppError(404, "Server not found");

  if (server.ownerId !== userId)
    throw new AppError(403, "Only the server owner can delete the server");

  await prisma.server.delete({
    where: {
      id: serverId,
    },
  });
}
