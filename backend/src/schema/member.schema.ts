import * as z from "zod";

export const MemberRoleSchema = z.object({
  role: z.enum(["MEMBER", "MODERATOR", "ADMIN"])
})

export type editMemberRoleSchema = z.infer<typeof MemberRoleSchema>
