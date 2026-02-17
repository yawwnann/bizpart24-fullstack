"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWhatsAppLink = void 0;
const generateWhatsAppLink = (phone, orderId, name, total) => {
    // Ensure phone starts with country code (e.g., 62 for Indonesia), standardizing 08xx to 628xx
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.slice(1);
    }
    const message = `Halo ${name}, pesanan Anda dengan ID *${orderId}* telah kami terima.\nTotal tagihan: Rp ${total.toLocaleString('id-ID')}.\n\nMohon segera lakukan pembayaran. Terima kasih!`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
};
exports.generateWhatsAppLink = generateWhatsAppLink;
