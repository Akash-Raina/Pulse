import express from "express"
import {login, signup} from "../controller/auth.controller.js";
import { validateUserLogin, validateUserSignUp } from "../middleware/validation.middleware.js";
import { handleError } from "../middleware/error.middleware.js";


const router = express.Router();

router.post('/signup', validateUserSignUp,  signup);
router.post('/login',validateUserLogin, login);


router.use(handleError)

export default router;

