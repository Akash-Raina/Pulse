import type { NextFunction, Request, Response } from "express";
import { loginSchema, signupSchema } from "../schema/auth.schema.js";
import { editServerSchema, serverParamsSchema, serverSchema } from "../schema/server.schema.js";

function validateUserSignUp(req: Request, _res: Response, next: NextFunction) {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) return next(result.error);

  req.body = result.data;
  next();
}

function validateUserLogin(req: Request, _res: Response, next: NextFunction) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) return next(result.error);

  req.body = result.data;
  next();
}

function validateServerSchema(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const result = serverSchema.safeParse(req.body);

  if (!result.success) return next(result.error);

  req.body = result.data;
  next();
}

function validateEditServer(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const result = editServerSchema.safeParse(req.body);

  if (!result.success) return next(result.error);

  req.body = result.data;
  next();
}

function validateServerParams(req: Request, _res: Response, next: NextFunction){
  req.params = serverParamsSchema.parse(req.params);

  next();
}
export {
  validateEditServer,
  validateServerSchema,
  validateUserLogin,
  validateUserSignUp,
  validateServerParams
};
