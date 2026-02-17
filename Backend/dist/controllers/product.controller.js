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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_model_1 = require("../models/product.model");
const cloudinary_1 = require("../utils/cloudinary");
class ProductController {
    constructor() {
        // Public
        this.getAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield product_model_1.Product.find().sort({ createdAt: -1 });
                res.json({ success: true, count: products.length, data: products });
            }
            catch (error) {
                next(error);
            }
        });
        this.getById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield product_model_1.Product.findById(req.params.id);
                if (!product) {
                    return res.status(404).json({ success: false, message: 'Product not found' });
                }
                res.json({ success: true, data: product });
            }
            catch (error) {
                next(error);
            }
        });
        // Admin Only
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, price, description, stock } = req.body;
                let imageUrl = '';
                if (req.file) {
                    imageUrl = (yield (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'products'));
                }
                else {
                    return res.status(400).json({ success: false, message: 'Image is required' });
                }
                const product = yield product_model_1.Product.create({
                    name,
                    price,
                    description,
                    stock,
                    image: imageUrl,
                });
                res.status(201).json({ success: true, data: product });
            }
            catch (error) {
                next(error);
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let product = yield product_model_1.Product.findById(req.params.id);
                if (!product) {
                    return res.status(404).json({ success: false, message: 'Product not found' });
                }
                const { name, price, description, stock } = req.body;
                let imageUrl = product.image;
                if (req.file) {
                    imageUrl = (yield (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'products'));
                }
                product = yield product_model_1.Product.findByIdAndUpdate(req.params.id, { name, price, description, stock, image: imageUrl }, { new: true, runValidators: true });
                res.json({ success: true, data: product });
            }
            catch (error) {
                next(error);
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield product_model_1.Product.findByIdAndDelete(req.params.id);
                if (!product) {
                    return res.status(404).json({ success: false, message: 'Product not found' });
                }
                res.json({ success: true, message: 'Product removed' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ProductController = ProductController;
