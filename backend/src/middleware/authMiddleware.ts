import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { JwtPayload } from "../types/auth.types";

// Extend Express Request to carry the authenticated user payload
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Auth middleware — validates the Bearer access token in the Authorization header.
 * Attaches the decoded JWT payload to `req.user`.
 * Rejects unauthenticated requests with 401.
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("No access token provided", 401, "UNAUTHORIZED"));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    next(new AppError("Invalid or expired access token", 401, "UNAUTHORIZED"));
  }
}

/**
 * Optional auth middleware — same as authMiddleware but does not reject
 * unauthenticated requests. Attaches `req.user` if a valid token is present.
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export function optionalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    req.user = payload;
  } catch {
    // Token invalid — proceed without user (optional auth)
  }

  next();
}
