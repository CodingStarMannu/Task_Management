import { Router, RequestHandler } from 'express';
import userRoutes from './userRoutes';
import taskRoutes from './taskRoutes';

const router = Router();

router.use('/api/users', userRoutes);
router.use('/api/tasks', taskRoutes);

export default router;

