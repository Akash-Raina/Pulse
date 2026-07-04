import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const {user, accessToken} = await authService.registerUser(req.body);

  res.status(201).json({
    message: "User created Successfully",
    user,
    accessToken
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const {user, accessToken} = await authService.loginUser(req.body);

  res.status(200).json({
    message: "Logged In successfully",
    user,
    accessToken
  });
});
