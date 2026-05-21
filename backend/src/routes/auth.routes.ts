import { Router } from 'express';
import { register, login, refresh, logout, me } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authMiddleware, me);

export default router;
