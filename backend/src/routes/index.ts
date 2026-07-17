import express from "express"
import authRouter from "./auth.route.js";
import serverRouter from './server.route.js'
import channelRouter from './channel.route.js'
import memberRouter from './member.route.js'

const router = express.Router();

router.use('/auth', authRouter);
router.use('/server', serverRouter);
router.use('/server',channelRouter);
router.use('/server', memberRouter);

export default router;

