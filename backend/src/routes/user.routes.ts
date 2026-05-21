import { Router } from 'express';
import { getMe, updateMe, changePassword } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/me', getMe);
router.patch('/me', updateMe);
router.patch('/me/password', changePassword);

export default router;
