import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";
import { ensureServerAccess } from "./permission.service.js";

export async function getMembers(serverId: string, userId: string) {
  //check if user is member of the server
  await ensureServerAccess(userId, serverId);

  const member = await prisma.member.findMany({
    where: {
      serverId,
    },
    select: {
      id: true,
      role: true,
      joinedAt: true,
      user:{
        select:{
          id: true,
          username: true,
          handle: true,
          avatar: true,
        }
      }
    },
    orderBy: {
      joinedAt: "asc"
    }
  });

  return member;
}
