import type { createChannelSchema } from "../schema/channel.schema.js";

export interface createChannelInput{
  serverId: string,
  userId: string,
  userInput: createChannelSchema
}
