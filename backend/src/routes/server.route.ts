import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateEditServer, validateServerParams, validateServerSchema } from "../middleware/validation.middleware.js";
import { createServer, deleteServer, editServer, getServers } from "../controller/server.controller.js";

const router = express.Router();

router.post('/createserver', authMiddleware, validateServerSchema, createServer);
router.get('/servers', authMiddleware, getServers);
router.patch('/:serverId', authMiddleware, validateServerParams, validateEditServer, editServer);
router.delete('/:serverId', authMiddleware, validateServerParams, deleteServer);
export default router
