import type { NextFunction, Request, Response } from "express";
import { signupSchema } from "../schema/auth.schema.js";


function validateUserSignUp(req: Request, res: Response, next: NextFunction){
    const result = signupSchema.safeParse(req.body);

    if(!result.success){
        res.status(400).json({
            message: result.error.flatten
        })
    }
    
    req.body = result.data;
    next();
}

export{
    validateUserSignUp
}
