import { Router } from 'express';
import { listProducts, getProduct, getFeatured } from '../controllers/product.controller';

const router = Router();

router.get('/featured', getFeatured);
router.get('/', listProducts);
router.get('/:slug', getProduct);

export default router;
