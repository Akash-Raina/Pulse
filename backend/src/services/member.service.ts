import { ROLE_RANKING } from "../constants/member-role.js";
import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";
import type { editMemberRoleSchema } from "../schema/member.schema.js";
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
      user: {
        select: {
          id: true,
          username: true,
          handle: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });

  return member;
}

export async function updateMemberRole(
  memberId: string,
  askedRole: editMemberRoleSchema,
  userId: string,
) {
  const member = await prisma.member.findUnique({
    where: {
      id: memberId,
    },
    select: {
      id: true,
      serverId: true,
      role: true,
    },
  });

  if (!member) throw new AppError(404, "Member not found");

  const isMemberAuth = await ensureServerAccess(userId, member.serverId);

  // Prevent changing your own role
  if (isMemberAuth.id === member.id)
    throw new AppError(403, "You cannot change your own role");

  // Cannot modify someone with an equal or higher role
  if (ROLE_RANKING[member.role] >= ROLE_RANKING[isMemberAuth.role])
    throw new AppError(403, "You don't have permission to modify this member");

  // Only the owner can assign the ADMIN role
  if (askedRole.role === "ADMIN" && isMemberAuth.role !== "OWNER")
    throw new AppError(403, "Only the owner can assign the ADMIN role");

  const newRole = await prisma.member.update({
    where: {
      id: memberId,
    },
    data: {
      role: askedRole.role,
    },
    select: {
      role: true,
      serverId: true,
    },
  });

  return newRole;
}

export async function removeMember(memberId: string, userId: string) {
  const memberToRemove = await prisma.member.findUnique({
    where: {
      id: memberId,
    },
    select: {
      id: true,
      userId: true,
      serverId: true,
      role: true,
    },
  });

  if (!memberToRemove) throw new AppError(404, "Member not found");

  const member = await ensureServerAccess(userId, memberToRemove.serverId);

  if (member.id === memberToRemove.id)
    throw new AppError(
      400,
      "Use the leave server endpoint to leave the server",
    );

  if (memberToRemove.role === "OWNER")
    throw new AppError(403, "The server owner cannot be removed");

  if (ROLE_RANKING[memberToRemove.role] >= ROLE_RANKING[member.role])
    throw new AppError(403, "You don't have permission to remove this member");

  await prisma.member.delete({
    where: {
      id: memberId,
    },
  });
}

export async function leaveServer(serverId: string, userId: string) {
  const member = await ensureServerAccess(userId, serverId);

  if (member.role === "OWNER")
    throw new AppError(
      403,
      "You can't leave server without transferring ownership",
    );

  await prisma.member.delete({
    where: {
      id: member.id,
    },
  });
}
