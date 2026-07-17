import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateParams } from "../middleware/validation.middleware.js";
import { serverParamsSchema } from "../schema/params.schema.js";
import { getMembers } from "../controller/member.controller.js";

const router = express.Router();

router.get('/:serverId/members', authMiddleware, validateParams(serverParamsSchema), getMembers)

export default router;
