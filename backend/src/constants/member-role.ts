import type { MemberRole } from "../generated/prisma/client.js";


export const ROLE_RANKING:Record<MemberRole, number> ={
  MEMBER: 0,
  MODERATOR: 1,
  ADMIN: 2,
  OWNER: 3
}
