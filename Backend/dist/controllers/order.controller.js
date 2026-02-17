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
exports.OrderController = void 0;
const order_model_1 = require("../models/order.model");
const product_model_1 = require("../models/product.model");
const cloudinary_1 = require("../utils/cloudinary");
const whatsapp_1 = require("../utils/whatsapp");
class OrderController {
    constructor() {
        // Public
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { customerName, phone, address, items } = req.body;
                let itemsTotal = 0;
                const orderItems = [];
                // Validate products and calculate total
                for (const item of items) {
                    const product = yield product_model_1.Product.findById(item.productId);
                    if (!product) {
                        return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
                    }
                    if (product.stock < item.qty) {
                        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
                    }
                    const subtotal = product.price * item.qty;
                    itemsTotal += subtotal;
                    orderItems.push({
                        productId: product._id,
                        name: product.name,
                        price: product.price,
                        qty: item.qty,
                        subtotal,
                    });
                }
                // Generate Order ID (INV-YYYY-XXXX)
                const date = new Date();
                const year = date.getFullYear();
                const count = yield order_model_1.Order.countDocuments({
                    createdAt: {
                        $gte: new Date(year, 0, 1),
                        $lt: new Date(year + 1, 0, 1)
                    }
                });
                const orderId = `INV-${year}-${(count + 1).toString().padStart(4, '0')}`;
                const order = yield order_model_1.Order.create({
                    orderId,
                    customerName,
                    phone,
                    address,
                    items: orderItems,
                    itemsTotal,
                    shippingCost: 0, // Default until admin updates
                    grandTotal: itemsTotal,
                });
                res.status(201).json({ success: true, data: order });
            }
            catch (error) {
                next(error);
            }
        });
        this.getByOrderId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield order_model_1.Order.findOne({ orderId: req.params.orderId });
                if (!order) {
                    return res.status(404).json({ success: false, message: 'Order not found' });
                }
                res.json({ success: true, data: order });
            }
            catch (error) {
                next(error);
            }
        });
        this.uploadProof = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.body;
                if (!req.file) {
                    return res.status(400).json({ success: false, message: 'Payment proof image is required' });
                }
                const order = yield order_model_1.Order.findOne({ orderId });
                if (!order) {
                    return res.status(404).json({ success: false, message: 'Order not found' });
                }
                const imageUrl = yield (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'orders');
                order.paymentProof = imageUrl;
                // Optional: Update status automatically or waiting for admin check
                // order.status = 'diproses'; 
                yield order.save();
                res.json({ success: true, message: 'Proof uploaded', data: order });
            }
            catch (error) {
                next(error);
            }
        });
        // Admin
        this.getAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield order_model_1.Order.find().sort({ createdAt: -1 });
                res.json({ success: true, count: orders.length, data: orders });
            }
            catch (error) {
                next(error);
            }
        });
        this.getByIdAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield order_model_1.Order.findById(req.params.id);
                if (!order) {
                    return res.status(404).json({ success: false, message: 'Order not found' });
                }
                res.json({ success: true, data: order });
            }
            catch (error) {
                next(error);
            }
        });
        this.updateShipping = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { shippingCost } = req.body;
                const order = yield order_model_1.Order.findById(req.params.id);
                if (!order) {
                    return res.status(404).json({ success: false, message: 'Order not found' });
                }
                order.shippingCost = Number(shippingCost);
                order.grandTotal = order.itemsTotal + order.shippingCost;
                order.status = 'menunggu_pembayaran'; // Assume status progresses
                yield order.save();
                // Send WhatsApp link for convenience
                const waLink = (0, whatsapp_1.generateWhatsAppLink)(order.phone, order.orderId, order.customerName, order.grandTotal);
                res.json({
                    success: true,
                    data: order,
                    whatsappLink: waLink
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.updateStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { status } = req.body;
                const order = yield order_model_1.Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
                if (!order) {
                    return res.status(404).json({ success: false, message: 'Order not found' });
                }
                res.json({ success: true, data: order });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.OrderController = OrderController;
