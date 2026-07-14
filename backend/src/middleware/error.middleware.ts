import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { ZodError } from "zod";

export function handleError(err: unknown, _req: Request, res: Response, _next: NextFunction){
    console.error(err);

    if(err instanceof AppError){
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }

    if(err instanceof ZodError){
      res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: err.issues
      })
    }

    if(err instanceof Error){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    })
}
