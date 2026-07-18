import type { transferOwnerSchema } from "../schema/server.schema.js";

export interface EditServerInput {
  serverId: string;
  userId: string;
  name?: string;
  icon?: string;
}

export interface transferOwnershipInput {
  serverId: string;
  userId: string;
  userInput: transferOwnerSchema;
}
