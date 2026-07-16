import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodObject } from "zod";
import { loginSchema, signupSchema } from "../schema/auth.schema.js";
import { channelSchema, editChannelSchema } from "../schema/channel.schema.js";
import { editServerSchema, serverSchema } from "../schema/server.schema.js";

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

function validateEditServer(req: Request, _res: Response, next: NextFunction) {
  const result = editServerSchema.safeParse(req.body);

  if (!result.success) return next(result.error);

  req.body = result.data;
  next();
}

function validateParams(schema: ZodObject): RequestHandler {
  return (req, _req, next) => {
    schema.parse(req.params);
    next();
  };
}

function validateChannelSchema(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const result = channelSchema.safeParse(req.body);

  if (!result.success) return next(result.error);

  req.body = result.data;
  next();
}

function validateEditChannel(req: Request, _res: Response, next: NextFunction) {
  const result = editChannelSchema.safeParse(req.body);
  if (!result.success) return next(result.error);

  req.body = result.data;
  next();
}
export {
  validateChannelSchema,
  validateEditServer,
  validateParams,
  validateServerSchema,
  validateUserLogin,
  validateUserSignUp,
  validateEditChannel
};
