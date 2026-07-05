import type { AuthRequestUser } from "./auth.types.ts";

declare global {
  namespace Express {
    interface Request {
      user: AuthRequestUser;
    }
  }
}

export {};
