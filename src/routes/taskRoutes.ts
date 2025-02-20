import { Router, RequestHandler } from 'express';
import { taskController } from '../controllers/taskController';
import { taskValidation } from '../validators/schemas';
import { auth, adminAuth } from '../middlewares/auth';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.use(auth);

router.post('/createTask',
  rateLimiter,
  taskValidation.create,
  taskController.createTask as RequestHandler
);

router.put('/updateTask/:id',
  rateLimiter,
  taskValidation.update,
  taskController.updateTask as RequestHandler
);

router.delete('/deleteTask/:id',
  taskController.deleteTask as RequestHandler
);

router.get('/',
  taskController.getTasks as RequestHandler
);

router.patch(
  '/updateTaskStatus/:id',
  rateLimiter,
  taskValidation.updateStatus,
  taskController.updateTaskStatus as RequestHandler
);


export default router;