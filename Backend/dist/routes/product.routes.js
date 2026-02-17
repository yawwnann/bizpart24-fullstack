"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const express_validator_1 = require("express-validator");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const router = (0, express_1.Router)();
const productController = new product_controller_1.ProductController();
// Public
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
// Admin
router.post('/', auth_middleware_1.protect, upload_middleware_1.upload.single('image'), [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('price').isNumeric().withMessage('Price must be a number'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('stock').isNumeric().withMessage('Stock must be a number'),
    validate_middleware_1.validate,
], productController.create);
router.put('/:id', auth_middleware_1.protect, upload_middleware_1.upload.single('image'), productController.update);
router.delete('/:id', auth_middleware_1.protect, productController.delete);
exports.default = router;
