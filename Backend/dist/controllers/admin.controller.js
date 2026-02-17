"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_model_1 = require("../models/admin.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AdminController {
    constructor() {
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const admin = yield admin_model_1.Admin.findOne({ email });
                if (admin && (yield bcryptjs_1.default.compare(password, admin.password))) {
                    res.json({
                        success: true,
                        token: jsonwebtoken_1.default.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' }),
                    });
                }
                else {
                    res.status(401).json({ success: false, message: 'Invalid email or password' });
                }
            }
            catch (error) {
                next(error);
            }
        });
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Temporary endpoint to create first admin
            try {
                const { email, password } = req.body;
                const adminExists = yield admin_model_1.Admin.findOne({ email });
                if (adminExists) {
                    return res.status(400).json({ success: false, message: 'Admin already exists' });
                }
                const admin = yield admin_model_1.Admin.create({ email, password });
                res.status(201).json({
                    success: true,
                    data: {
                        _id: admin._id,
                        email: admin.email
                    }
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminController = AdminController;
