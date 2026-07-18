import express from "express";
import {
  createServer,
  deleteServer,
  editServer,
  getServers,
  transferOwnership,
} from "../controller/server.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  validateEditServer,
  validateNewOwner,
  validateParams,
  validateServerSchema,
} from "../middleware/validation.middleware.js";
import { serverParamsSchema } from "../schema/params.schema.js";

const router = express.Router();

router.post(
  "/createserver",
  authMiddleware,
  validateServerSchema,
  createServer,
);
router.get("/servers", authMiddleware, getServers);
router.patch(
  "/:serverId",
  authMiddleware,
  validateParams(serverParamsSchema),
  validateEditServer,
  editServer,
);
router.patch(
  "/:serverId/transferownership",
  authMiddleware,
  validateParams(serverParamsSchema),
  validateNewOwner,
  transferOwnership,
);
router.delete(
  "/:serverId",
  authMiddleware,
  validateParams(serverParamsSchema),
  deleteServer,
);

export default router;
