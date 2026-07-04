import express from "express"
import {login, logout, refresh, signup} from "../controller/auth.controller.js";
import { validateUserLogin, validateUserSignUp } from "../middleware/validation.middleware.js";
import { handleError } from "../middleware/error.middleware.js";
import cookieParser from "cookie-parser";


const router = express.Router();

router.use(cookieParser());

router.post('/signup', validateUserSignUp,  signup);
router.post('/login',validateUserLogin, login);
router.post('/logout', logout);
router.post('/refresh', refresh)

router.use(handleError)

export default router;

