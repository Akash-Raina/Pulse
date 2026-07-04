import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

export function handleError(err: unknown, _req: Request, res: Response, _next: NextFunction){
    console.error(err);

    if(err instanceof AppError){
        res.status(err.statusCode).json({
            success: false,
            message: err.message
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
