"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const express_validator_1 = require("express-validator");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const router = (0, express_1.Router)();
const adminController = new admin_controller_1.AdminController();
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please include a valid email'),
    (0, express_validator_1.body)('password').exists().withMessage('Password is required'),
    validate_middleware_1.validate,
], adminController.login);
// Optional: Route to create initial admin (ensure to protect or remove after use)
router.post('/register', adminController.register);
exports.default = router;
