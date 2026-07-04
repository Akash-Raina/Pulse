import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const signup = asyncHandler(async (req:Request, res:Response) => {
    const user = await authService.registerUser(req.body);

    res.status(201).json(user);
});
