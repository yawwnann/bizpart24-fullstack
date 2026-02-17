import { Router } from 'express';
import { ModelController } from '../controllers/model.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();
const modelController = new ModelController();

// Public routes
router.get('/', modelController.getAll);
router.get('/:id', modelController.getById);

// Admin routes
router.post('/', protect, modelController.create);
router.put('/:id', protect, modelController.update);
router.delete('/:id', protect, modelController.delete);

export default router;
