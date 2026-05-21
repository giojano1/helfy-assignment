import { Router } from 'express';
import { getCart, addItem, updateItem, removeItem, clearCart, mergeCart } from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getCart);
router.post('/items', addItem);
router.patch('/items/:id', updateItem);
router.delete('/items/:id', removeItem);
router.post('/merge', mergeCart);
router.delete('/', clearCart);

export default router;
