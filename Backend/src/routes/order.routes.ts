import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate.middleware';

const router = Router();
const orderController = new OrderController();

// Public
router.post(
  '/create',
  [
    body('customerName').notEmpty(),
    body('phone').notEmpty(),
    body('address').notEmpty(),
    body('items').isArray({ min: 1 }),
    validate,
  ],
  orderController.create
);
router.get('/:orderId', orderController.getByOrderId);
router.post('/upload-proof', upload.single('image'), orderController.uploadProof);

// Admin
router.get('/admin/list', protect, orderController.getAll); // Changed path to avoid conflict with :orderId if not careful, though here separate prefixes is safest. Let's stick to user request structure but under /api/admin/orders usually.
// Actually allow me to restructure in index.ts better. For now:
router.get('/admin/:id', protect, orderController.getByIdAdmin); 
router.put('/admin/:id/ongkir', protect, orderController.updateShipping);
router.put('/admin/:id/status', protect, orderController.updateStatus);

export default router;
