import { Request, Response, NextFunction } from 'express';
import { updateProfileSchema, changePasswordSchema } from '../schemas/user.schema';
import * as userService from '../services/user.service';

/**
 * GET /api/v1/users/me
 */
export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await userService.getProfile(req.user!.sub);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/v1/users/me
 */
export async function updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = updateProfileSchema.parse(req.body);
    const profile = await userService.updateProfile(req.user!.sub, dto);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/v1/users/me/password
 */
export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = changePasswordSchema.parse(req.body);
    await userService.changePassword(req.user!.sub, dto);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
