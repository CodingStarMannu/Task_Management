import { Router, RequestHandler } from 'express';
import { register, login}  from '../controllers/userController';
import { userValidation } from '../validators/schemas';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/register', 
  rateLimiter,
  userValidation.register,
  register as RequestHandler
);

router.post('/login',
  rateLimiter,
  userValidation.login,
  login as RequestHandler
);

export default router;
