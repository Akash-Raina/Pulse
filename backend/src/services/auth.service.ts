import bcrypt from "bcrypt";
import type { Request } from "express";
import { AppError } from "../errors/AppError.js";
import { generateAccessTokens } from "../lib/jwt.js";
import { prisma } from "../lib/prisma.js";
import type { SignupBody } from "../schema/auth.schema.js";
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
  const accessToken = generateAccessTokens(user.id);

  return { accessToken, user };
}

export { registerUser };
