import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateEditServerSchema, validateServerSchema } from "../middleware/validation.middleware.js";
import { createServer, editServer, getServers } from "../controller/server.controller.js";

const router = express.Router();

router.post('/createserver', authMiddleware, validateServerSchema, createServer);
router.get('/servers', authMiddleware, getServers);
router.patch('/:serverId', authMiddleware, validateEditServerSchema, editServer)

export default router
