import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';
import adminRoutes from './admin.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import regionRoutes from './region.routes';

import categoryRoutes from './category.routes';
import makeRoutes from './make.routes';
import modelRoutes from './model.routes';

const router = Router();
const healthController = new HealthController();

router.get('/health', healthController.check);
router.use('/admin', adminRoutes);
router.use('/products', productRoutes); // Public product routes
router.use('/admin/products', productRoutes); // Admin product routes (auth handled in router)
router.use('/categories', categoryRoutes); // New Category Routes
router.use('/makes', makeRoutes); // Make Routes
router.use('/models', modelRoutes); // Model Routes
router.use('/orders', orderRoutes);
router.use('/v1/regions', regionRoutes);

export default router;
