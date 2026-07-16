import express from "express";
import { createChannel, getChannel, getChannels } from "../controller/channel.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  validateChannelSchema,
  validateParams,
} from "../middleware/validation.middleware.js";
import { channelParamsSchema, serverParamsSchema } from "../schema/params.schema.js";

const router = express.Router();

router.post(
  "/:serverId/channels",
  authMiddleware,
  validateParams(serverParamsSchema),
  validateChannelSchema,
  createChannel,
);

router.get(
  "/:serverId/channels",
  authMiddleware,
  validateParams(serverParamsSchema),
  getChannels
);

router.get(
  "/channels/:channelId",
  authMiddleware,
  validateParams(channelParamsSchema),
  getChannel
);

// router.patch(
//   "/channels/:channelId"
// );

// router.delete(
//   "/channels/:channelId"
// )

export default router;
