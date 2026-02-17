"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const express_validator_1 = require("express-validator");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const router = (0, express_1.Router)();
const orderController = new order_controller_1.OrderController();
// Public
router.post('/create', [
    (0, express_validator_1.body)('customerName').notEmpty(),
    (0, express_validator_1.body)('phone').notEmpty(),
    (0, express_validator_1.body)('address').notEmpty(),
    (0, express_validator_1.body)('items').isArray({ min: 1 }),
    validate_middleware_1.validate,
], orderController.create);
router.get('/:orderId', orderController.getByOrderId);
router.post('/upload-proof', upload_middleware_1.upload.single('image'), orderController.uploadProof);
// Admin
router.get('/admin/list', auth_middleware_1.protect, orderController.getAll); // Changed path to avoid conflict with :orderId if not careful, though here separate prefixes is safest. Let's stick to user request structure but under /api/admin/orders usually.
// Actually allow me to restructure in index.ts better. For now:
router.get('/admin/:id', auth_middleware_1.protect, orderController.getByIdAdmin);
router.put('/admin/:id/ongkir', auth_middleware_1.protect, orderController.updateShipping);
router.put('/admin/:id/status', auth_middleware_1.protect, orderController.updateStatus);
exports.default = router;
