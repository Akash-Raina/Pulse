import express from "express"
import {signup} from "../controller/auth.controller.js";
import { validateUserSignUp } from "../middleware/validation.middleware.js";
import { handleError } from "../middleware/error.middleware.js";


const router = express.Router();

router.post('/signup', validateUserSignUp,  signup);


router.use(handleError)

export default router;

