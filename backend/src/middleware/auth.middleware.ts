import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { verifyAccessToken } from "../lib/jwt.js";

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization;

  if (!token?.startsWith("Bearer ")) throw new AppError(401, "Unauthorized");

  const accessToken = token.split(" ")[1];

  const userId = verifyAccessToken(accessToken);

  req.user = {
    id: userId,
  };

  next();
}
