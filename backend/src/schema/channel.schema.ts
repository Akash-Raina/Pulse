import * as z from "zod"
import { MemberRole, ChannelType} from "../generated/prisma/enums.js";

export const channelSchema = z.object({
  name: z.string().trim().min(1).max(30),
  type: z.enum(ChannelType),
  minimumRole: z.enum(MemberRole).optional()
})

export type createChannelSchema =z.infer<typeof channelSchema>
