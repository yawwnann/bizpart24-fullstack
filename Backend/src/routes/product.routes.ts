import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate.middleware';

const router = Router();
const productController = new ProductController();

// Public
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Admin
router.post(
  '/',
  protect,
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('description').notEmpty().withMessage('Description is required'),
    body('stock').isNumeric().withMessage('Stock must be a number'),
    validate,
  ],
  productController.create
);

router.put('/:id', protect, upload.single('image'), productController.update);
router.delete('/:id', protect, productController.delete);

export default router;
