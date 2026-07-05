import bcrypt from "bcrypt";
import { AppError } from "../errors/AppError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../lib/jwt.js";
import { prisma } from "../lib/prisma.js";
import type { loginSchema, SignupBody } from "../schema/auth.schema.js";
import generateHandle from "../utils/generateHandle.js";

async function registerUser(data: SignupBody) {
  const { username, email, password } = data;

  //find if email already exist
  const emailExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (emailExists) throw new AppError(409, "Email already exists");

  // generate unique handle
  const handle = await generateHandle(username);

  //hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  //create new user
  const user = await prisma.user.create({
    data: {
      username,
      handle,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      handle: true,
      email: true,
      createdAt: true,
    },
  });

  //generate jwt
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

async function loginUser(data: loginSchema) {
  const { email, password } = data;

  //check if the email exists
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) throw new AppError(401, "Email doesn't exist");

  //verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw new AppError(401, "Incorrect Password");

  //create jwt
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const userId = verifyRefreshToken(refreshToken);

  //check if user still exists
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) throw new AppError(401, "Invalid refresh token");

  return generateAccessToken(user.id);
}

async function getUserInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      handle: true,
      email: true,
      avatar: true,
      bio: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) throw new AppError(404, "User not found");

  return user;
}

export { getUserInfo, loginUser, refreshAccessToken, registerUser };
