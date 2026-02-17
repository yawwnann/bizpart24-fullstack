import { Router } from 'express';
import { MakeController } from '../controllers/make.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();
const makeController = new MakeController();

// Public routes
router.get('/', makeController.getAll);
router.get('/:id', makeController.getById);

// Admin routes
router.post('/', protect, makeController.create);
router.put('/:id', protect, makeController.update);
router.delete('/:id', protect, makeController.delete);

export default router;
