"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            qty: { type: Number, required: true },
            subtotal: { type: Number, required: true },
        },
    ],
    itemsTotal: {
        type: Number,
        required: true,
    },
    shippingCost: {
        type: Number,
        default: 0,
    },
    grandTotal: {
        type: Number,
        required: true,
    },
    paymentProof: {
        type: String,
    },
    status: {
        type: String,
        enum: [
            'menunggu_ongkir',
            'menunggu_pembayaran',
            'diproses',
            'dikirim',
            'selesai',
        ],
        default: 'menunggu_ongkir',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.Order = mongoose_1.default.model('Order', orderSchema);
