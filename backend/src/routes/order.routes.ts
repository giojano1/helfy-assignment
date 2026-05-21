import { Router } from 'express';
import { createOrder, listOrders, getOrder } from '../controllers/order.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/', listOrders);
router.get('/:id', getOrder);

export default router;
