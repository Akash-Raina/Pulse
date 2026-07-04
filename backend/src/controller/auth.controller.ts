import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../utils/cookies.js";
import { AppError } from "../errors/AppError.js";
import { refreshAccessToken } from "../services/auth.service.js";
import { success } from "zod";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const {user, accessToken, refreshToken} = await authService.registerUser(req.body);

  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    message: "User created Successfully",
    user,
    accessToken
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const {user, accessToken, refreshToken} = await authService.loginUser(req.body);

  setRefreshTokenCookie(res, refreshToken)

  res.status(200).json({
    message: "Logged In successfully",
    user,
    accessToken
  });
});

export const logout = (_req: Request, res: Response)=>{
  clearRefreshTokenCookie(res);

  res.status(200).json({
    success: true,
    message: "Logged Out successfully"
  })
}

export const refresh = asyncHandler(async(req: Request, res: Response) =>{
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken) throw new AppError(401, "Refresh token not found");

  const accessToken = await refreshAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    accessToken
  })

})
