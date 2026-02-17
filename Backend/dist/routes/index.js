"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_controller_1 = require("../controllers/health.controller");
const admin_routes_1 = __importDefault(require("./admin.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const router = (0, express_1.Router)();
const healthController = new health_controller_1.HealthController();
router.get('/health', healthController.check);
router.use('/admin', admin_routes_1.default);
router.use('/products', product_routes_1.default); // Public product routes
router.use('/admin/products', product_routes_1.default); // Admin product routes (auth handled in router)
router.use('/orders', order_routes_1.default);
exports.default = router;
