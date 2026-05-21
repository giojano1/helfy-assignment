import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import * as authService from '../services/auth.service';

/**
 * POST /api/v1/auth/register
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = registerSchema.parse(req.body);
    const result = await authService.registerUser(dto, res);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/login
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = loginSchema.parse(req.body);
    const result = await authService.loginUser(dto, res);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/refresh
 */
export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No refresh token' } });
      return;
    }
    const result = await authService.refreshAccessToken(token);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/logout
 */
export function logout(req: Request, res: Response, next: NextFunction): void {
  try {
    authService.logoutUser(res);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/auth/me
 */
export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.sub;
    const user = await authService.getMe(userId);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
