import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateEditServer, validateParams, validateServerSchema } from "../middleware/validation.middleware.js";
import { createServer, deleteServer, editServer, getServers } from "../controller/server.controller.js";
import { serverParamsSchema } from "../schema/params.schema.js";

const router = express.Router();

router.post('/createserver', authMiddleware, validateServerSchema, createServer);
router.get('/servers', authMiddleware, getServers);
router.patch('/:serverId', authMiddleware, validateParams(serverParamsSchema), validateEditServer, editServer);
router.delete('/:serverId', authMiddleware, validateParams(serverParamsSchema), deleteServer);

export default router
