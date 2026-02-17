import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();
const categoryController = new CategoryController();

// Public
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// Admin
router.post('/', protect, upload.single('image'), categoryController.create);
router.put('/:id', protect, upload.single('image'), categoryController.update);
router.delete('/:id', protect, categoryController.delete);

export default router;
