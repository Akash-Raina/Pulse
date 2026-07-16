import type { createChannelSchema, editChannelSchema } from "../schema/channel.schema.js";

export interface createChannelInput{
  serverId: string,
  userId: string,
  userInput: createChannelSchema
}
export interface editChannelInput{
  channelId: string,
  userId: string,
  userInput: editChannelSchema
}
