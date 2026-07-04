import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

export function generateAccessTokens(userId: string):string{

    const secret = process.env.JWT_ACCESS_SECRET!;

    const accessToken = jwt.sign({userId}, secret, {expiresIn: "7d"});

    return accessToken;
}