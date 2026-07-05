import dotenv from "dotenv";
import jwt from "jsonwebtoken";

interface JwtPayload{
  userId: string
}

dotenv.config();

const accessSecret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;

export function generateAccessToken(userId: string): string {

  const accessToken = jwt.sign({ userId }, accessSecret, { expiresIn: "15m" });

  return accessToken;
}

export function generateRefreshToken(userId: string): string {

  const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: "30d" });

  return refreshToken;
}

export function verifyRefreshToken(refreshToken: string){

  const payload = jwt.verify(refreshToken, refreshSecret) as JwtPayload;

  return payload.userId;
}

export function verifyAccessToken(accessToken: string){

  const payload = jwt.verify(accessToken, accessSecret) as JwtPayload;

  return payload.userId;
}
