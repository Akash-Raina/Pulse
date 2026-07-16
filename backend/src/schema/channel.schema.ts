import * as z from "zod";
import { ChannelType, MemberRole } from "../generated/prisma/enums.js";

export const channelSchema = z.object({
  name: z.string().trim().min(1).max(30),
  type: z.enum(ChannelType),
  minimumRole: z.enum(MemberRole).optional(),
});

export const editChannelSchema = z
  .object({
    name: z.string().trim().min(1).max(30).optional(),
    minimumRole: z.enum(MemberRole).optional(),
    icon: z.url().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided.",
  );

export type createChannelSchema = z.infer<typeof channelSchema>;
export type editChannelSchema = z.infer<typeof editChannelSchema>;
