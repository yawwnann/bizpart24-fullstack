interface OrderForWA {
  phone: string;
  orderId: string;
  customerName: string;
  itemsTotal: number;
  shippingCost: number;
  grandTotal: number;
  items: Array<{ name: string; qty: number; subtotal: number }>;
}

interface OrderForTracking {
  phone: string;
  orderId: string;
  customerName: string;
  courierType: string | null;
  trackingNumber: string | null;
}

export const generateWhatsAppLink = (order: OrderForWA) => {
  const bankName = process.env.BANK_NAME || "BCA";
  const bankAccount = process.env.BANK_ACCOUNT_NUMBER || "1234567890";
  const bankHolder = process.env.BANK_ACCOUNT_NAME || "PT BIZSPAREPART24";
  const frontendUrl =
    process.env.FRONTEND_URL || "https://bizpart24-fullstack.vercel.app";

  let formattedPhone = order.phone.replace(/\D/g, "");
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "62" + formattedPhone.slice(1);
  }

  const itemLines = order.items
    .map(
      (item) =>
        `  - ${item.name} x${item.qty} → Rp ${item.subtotal.toLocaleString("id-ID")}`,
    )
    .join("\n");

  const message =
    `Halo *${order.customerName}*, \n\n` +
    `Pesanan Anda *#${order.orderId}* telah dikonfirmasi!\n\n` +
    ` *Detail Pesanan:*\n${itemLines}\n\n` +
    ` *Rincian Tagihan:*\n` +
    `Subtotal Produk : Rp ${order.itemsTotal.toLocaleString("id-ID")}\n` +
    `Ongkos Kirim    : Rp ${order.shippingCost.toLocaleString("id-ID")}\n` +
    `*Total Bayar    : Rp ${order.grandTotal.toLocaleString("id-ID")}*\n\n` +
    ` *Transfer ke:*\n` +
    `${bankName} — ${bankAccount}\n` +
    `a.n. ${bankHolder}\n\n` +
    `Setelah transfer, harap konfirmasi pembayaran di:\n${frontendUrl}/payment\n\n` +
    `Terima kasih! `;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
};

export const generateTrackingWhatsAppLink = (order: OrderForTracking) => {
  let formattedPhone = order.phone.replace(/\D/g, "");
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "62" + formattedPhone.slice(1);
  }

  const courier = order.courierType || "Ekspedisi";
  const resi = order.trackingNumber
    ? `*No. Resi: ${order.trackingNumber}*`
    : "(Nomor resi akan segera dikirimkan)";

  const message =
    `Halo *${order.customerName}*, \n\n` +
    `Pesanan Anda *#${order.orderId}* sudah *dikirim*!\n\n` +
    ` *Info Pengiriman:*\n` +
    `Ekspedisi : ${courier}\n` +
    `${resi}\n\n` +
    `Terima kasih telah berbelanja di BIZSPAREPART24! \n` +
    `Jika ada pertanyaan, balas pesan ini.`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
};
