import express from "express";
import {
  getMembers,
  leaveServer,
  removeMember,
  updateMemberRole,
} from "../controller/member.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  validateParams,
  validateUpdateMemberRole,
} from "../middleware/validation.middleware.js";
import {
  memberParamsSchema,
  serverParamsSchema,
} from "../schema/params.schema.js";

const router = express.Router();

router.get(
  "/:serverId/members",
  authMiddleware,
  validateParams(serverParamsSchema),
  getMembers,
);
router.patch(
  "/members/:memberId",
  authMiddleware,
  validateParams(memberParamsSchema),
  validateUpdateMemberRole,
  updateMemberRole,
);
router.delete(
  "/members/:memberId",
  authMiddleware,
  validateParams(memberParamsSchema),
  removeMember,
);
router.delete(
  "/:serverId/leave",
  authMiddleware,
  validateParams(serverParamsSchema),
  leaveServer,
);
export default router;
