import express from "express";
import { createChannel, getChannels } from "../controller/channel.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  validateChannelSchema,
  validateServerParams,
} from "../middleware/validation.middleware.js";

const router = express.Router();

router.post(
  "/:serverId/channels",
  authMiddleware,
  validateServerParams,
  validateChannelSchema,
  createChannel,
);

router.get(
  "/:serverId/channels",
  authMiddleware,
  validateServerParams,
  getChannels
);

// router.get(
//   "/channels/:channelId"
// );

// router.patch(
//   "/channels/:channelId"
// );

// router.delete(
//   "/channels/:channelId"
// )

export default router;
