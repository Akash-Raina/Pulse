import { prisma } from "../lib/prisma.js";

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
