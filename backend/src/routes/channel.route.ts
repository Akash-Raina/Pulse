import express from "express";
import { createChannel } from "../controller/channel.controller.js";
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

export default router;
