import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate.middleware';

const router = Router();
const adminController = new AdminController();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
    validate,
  ],
  adminController.login
);

// Optional: Route to create initial admin (ensure to protect or remove after use)
router.post('/register', adminController.register);

export default router;
