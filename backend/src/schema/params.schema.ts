import { z } from "zod";

export const serverParamsSchema = z.object({
  serverId: z.uuid(),
});

export const channelParamsSchema = z.object({
  channelId: z.uuid(),
});

export const serverChannelParamsSchema = z.object({
  serverId: z.uuid(),
  channelId: z.uuid(),
});
