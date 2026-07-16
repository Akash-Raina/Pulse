import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";

export async function ensureServerAccess(userId: string, serverId: string) {
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

  return member;
}
