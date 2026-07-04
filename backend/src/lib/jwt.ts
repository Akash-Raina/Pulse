import dotenv from "dotenv";
import jwt from "jsonwebtoken";

interface JwtPayload{
  userId: string
}

dotenv.config();

export function generateAccessToken(userId: string): string {
  const secret = process.env.JWT_ACCESS_SECRET!;

  const accessToken = jwt.sign({ userId }, secret, { expiresIn: "15m" });

  return accessToken;
}

export function generateRefreshToken(userId: string): string {
  const secret = process.env.JWT_REFRESH_SECRET!;

  const refreshToken = jwt.sign({ userId }, secret, { expiresIn: "30d" });

  return refreshToken;
}

export function verifyRefreshToken(refreshToken: string){
  const secret = process.env.JWT_REFRESH_SECRET!;

  const payload = jwt.verify(refreshToken, secret) as JwtPayload;

  return payload.userId
}
