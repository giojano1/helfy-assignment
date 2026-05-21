import { Request, Response, NextFunction } from 'express';
import { addToCartSchema, updateCartItemSchema, mergeCartSchema } from '../schemas/cart.schema';
import * as cartService from '../services/cart.service';

/**
 * GET /api/v1/cart
 */
export async function getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cart = await cartService.getCart(req.user!.sub);
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/cart/items
 */
export async function addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = addToCartSchema.parse(req.body);
    const cart = await cartService.addItem(req.user!.sub, dto);
    res.status(201).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/v1/cart/items/:id
 */
export async function updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = updateCartItemSchema.parse(req.body);
    const cart = await cartService.updateItem(req.user!.sub, req.params['id'] as string, dto);
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/cart/items/:id
 */
export async function removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cart = await cartService.removeItem(req.user!.sub, req.params['id'] as string);
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/cart
 */
export async function clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await cartService.clearCart(req.user!.sub);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/cart/merge
 */
export async function mergeCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = mergeCartSchema.parse(req.body);
    const cart = await cartService.mergeGuestCart(req.user!.sub, dto);
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}
