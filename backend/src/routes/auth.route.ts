import express  from "express"
import {login, logout, me, refresh, signup} from "../controller/auth.controller.js";
import { validateUserLogin, validateUserSignUp } from "../middleware/validation.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/signup', validateUserSignUp,  signup);
router.post('/login',validateUserLogin, login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', authMiddleware, me);

export default router
