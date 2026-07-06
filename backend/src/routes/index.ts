import express from "express"
import { handleError } from "../middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import authRouter from "./auth.route.js";
import serverRouter from './server.route.js'
const router = express.Router();

router.use(cookieParser());

router.use('/auth', authRouter);
router.use('/server', serverRouter);

router.use(handleError);

export default router;

