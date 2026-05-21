import { Request, Response, NextFunction } from 'express';
import { createOrderSchema } from '../schemas/order.schema';
import { z } from 'zod';
import * as orderService from '../services/order.service';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

/**
 * POST /api/v1/orders
 */
export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = createOrderSchema.parse(req.body);
    const order = await orderService.createOrder(req.user!.sub, dto);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/orders
 */
export async function listOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const { orders, meta } = await orderService.listOrders(req.user!.sub, page, limit);
    res.json({ success: true, data: orders, meta });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/orders/:id
 */
export async function getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await orderService.getOrderById(req.user!.sub, req.params['id'] as string);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}
