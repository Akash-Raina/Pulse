import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateServerSchema } from "../middleware/validation.middleware.js";
import { createServer, getServers } from "../controller/server.controller.js";

const router = express.Router();

router.post('/createserver', authMiddleware, validateServerSchema, createServer);
router.get('/servers', authMiddleware, getServers)

export default router
