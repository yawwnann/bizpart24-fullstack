import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@bizpart24.com";
const BANK_NAME = process.env.BANK_NAME || "BCA";
const BANK_ACCOUNT = process.env.BANK_ACCOUNT_NUMBER || "1234567890";
const BANK_HOLDER = process.env.BANK_ACCOUNT_NAME || "PT BIZPART24";

export class MailService {
  // 1. Kirim Email ke Customer: Pesanan Dibuat (Menunggu Ongkir)
  static async sendOrderCreatedEmail(order: any) {
    try {
      if (!order.email) return;

      const { data, error } = await resend.emails.send({
        from: `BIZPART24 <${FROM_EMAIL}>`,
        to: [order.email],
        subject: `Invoice #${order.orderId} - Menunggu Konfirmasi Ongkir`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #D92D20; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">BIZPART24</h1>
            </div>
            <div style="padding: 20px;">
              <h2>Terima Kasih atas Pesanan Anda!</h2>
              <p>Halo <strong>${order.customerName}</strong>,</p>
              <p>Pesanan Anda <strong>#${order.orderId}</strong> telah kami terima.</p>
              <p>Saat ini Admin kami sedang menghitung ongkos kirim ke alamat Anda. Mohon tunggu email selanjutnya untuk total tagihan lengkap.</p>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Detail Pesanan:</h3>
                <ul style="padding-left: 20px;">
                  ${order.items.map((item: any) => `<li>${item.name} x ${item.qty} - Rp ${item.subtotal.toLocaleString("id-ID")}</li>`).join("")}
                </ul>
                <p><strong>Subtotal Produk: Rp ${order.itemsTotal.toLocaleString("id-ID")}</strong></p>
                <p><em>Ongkos Kirim: Menunggu Konfirmasi Admin</em></p>
              </div>

              <p>Jika ada pertanyaan, silakan hubungi kami via WhatsApp.</p>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
              &copy; ${new Date().getFullYear()} BIZPART24. All rights reserved.
            </div>
          </div>
        `,
      });

      if (error) {
        console.error("MailService Error (User Order Created):", error);
      } else {
        console.log("MailService Success (User Order Created):", data);
      }
    } catch (err) {
      console.error("MailService Exception:", err);
    }
  }

  // 2. Kirim Email ke Admin: Pesanan Baru Masuk
  static async sendAdminNewOrderEmail(order: any) {
    try {
      // In production, use real admin email
      // For standard 'onboarding@resend.dev', you can only send to verified email (usually yourself)
      // So ensure ADMIN_EMAIL is your verified email in Resend dashboard
      const toEmail =
        process.env.ADMIN_EMAIL || "your_verified_email@example.com";

      const frontendUrl =
        process.env.FRONTEND_URL ||
        "http://https://bizpart24-fullstack.vercel.app/";

      const { data, error } = await resend.emails.send({
        from: `System Notification <${FROM_EMAIL}>`,
        to: [toEmail],
        subject: `[ADMIN] Pesanan Baru #${order.orderId} - Butuh Input Ongkir`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Pesanan Baru Masuk!</h2>
            <p>Order ID: <strong>${order.orderId}</strong></p>
            <p>Customer: ${order.customerName} (${order.phone})</p>
            <p>Alamat: ${order.address}</p>
            
            <h3>Items:</h3>
            <ul>
               ${order.items.map((item: any) => `<li>${item.name} x ${item.qty}</li>`).join("")}
            </ul>

            <div style="margin-top: 20px;">
              <a href="${frontendUrl}/admin/orders/${order._id}" style="background-color: #D92D20; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Input Ongkir Sekarang</a>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error("MailService Error (Admin Notification):", error);
      }
    } catch (err) {
      console.error("MailService Exception:", err);
    }
  }

  // 3. Kirim Email ke Customer: Ongkir Diupdate (Siap Bayar)
  static async sendShippingUpdatedEmail(order: any) {
    try {
      if (!order.email) {
        console.warn(
          "[sendShippingUpdatedEmail] No email address for order",
          order.orderId,
        );
        return;
      }

      console.log(
        "[sendShippingUpdatedEmail] Sending to:",
        order.email,
        "for order:",
        order.orderId,
      );

      const frontendUrl =
        process.env.FRONTEND_URL ||
        "http://https://bizpart24-fullstack.vercel.app/";

      const itemsTotal = Number(order.itemsTotal);
      const shippingCost = Number(order.shippingCost);
      const grandTotal = Number(order.grandTotal);
      const items: Array<{ name: string; qty: number; subtotal: number }> =
        order.items ?? [];

      const { data, error } = await resend.emails.send({
        from: `BIZPART24 <${FROM_EMAIL}>`,
        to: [order.email],
        subject: `Tagihan Updated #${order.orderId} - Silakan Lakukan Pembayaran`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #D92D20; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">BIZPART24</h1>
            </div>
            <div style="padding: 20px;">
              <h2>Total Tagihan Anda Telah Diupdate!</h2>
              <p>Halo <strong>${order.customerName}</strong>,</p>
              <p>Admin kami telah menghitung ongkos kirim untuk pesanan <strong>#${order.orderId}</strong>.</p>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Rincian Pembayaran:</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr><td colspan="2" style="padding-bottom:8px;"><strong>Detail Pesanan:</strong></td></tr>
                  ${items
                    .map(
                      (item) => `
                  <tr>
                    <td style="padding: 3px 0; color:#444;">${item.name} x${item.qty}</td>
                    <td style="text-align:right; color:#444;">Rp ${Number(item.subtotal).toLocaleString("id-ID")}</td>
                  </tr>`,
                    )
                    .join("")}
                  <tr><td colspan="2"><hr style="border:0;border-top:1px solid #ddd;margin:10px 0;"></td></tr>
                  <tr>
                    <td>Subtotal Produk:</td>
                    <td style="text-align: right;">Rp ${itemsTotal.toLocaleString("id-ID")}</td>
                  </tr>
                  <tr>
                    <td>Ongkos Kirim:</td>
                    <td style="text-align: right;">Rp ${shippingCost.toLocaleString("id-ID")}</td>
                  </tr>
                  <tr><td colspan="2"><hr style="border:0;border-top:1px solid #ddd;margin:10px 0;"></td></tr>
                  <tr style="font-weight: bold; font-size: 18px;">
                    <td>Total Bayar:</td>
                    <td style="text-align: right; color: #D92D20;">Rp ${grandTotal.toLocaleString("id-ID")}</td>
                  </tr>
                </table>
              </div>

              <h3 style="margin-top: 0; font-size: 14px; color: #666;">INSTRUKSI PEMBAYARAN</h3>
              <div style="background: #fff; border: 1.5px solid #D92D20; border-radius: 8px; padding: 16px; margin: 0;">
                <p style="margin: 0 0 4px; font-size: 13px; color: #666;">Transfer ke rekening:</p>
                <p style="margin: 0 0 2px; font-size: 20px; font-weight: bold; letter-spacing: 2px; color: #111;">${BANK_ACCOUNT}</p>
                <p style="margin: 0; font-size: 13px; color: #555;">${BANK_NAME} — a.n. <strong>${BANK_HOLDER}</strong></p>
              </div>

              <p style="margin-top: 20px;">Setelah transfer, silakan konfirmasi pembayaran Anda disini:</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${frontendUrl}/payment?orderId=${order.orderId}" style="background-color: #D92D20; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Konfirmasi Pembayaran</a>
              </div>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
              &copy; ${new Date().getFullYear()} BIZPART24. All rights reserved.
            </div>
          </div>
        `,
      });

      if (error) {
        console.error("MailService Error (User Shipping Update):", error);
      } else {
        console.log("MailService Success (User Shipping Update):", data);
      }
    } catch (err) {
      console.error("MailService Exception:", err);
    }
  }

  // 4. Kirim Email ke Admin: Notif Bukti Pembayaran Diunggah
  static async sendPaymentProofEmail(order: any) {
    try {
      const toEmail =
        process.env.ADMIN_EMAIL || "your_verified_email@example.com";
      const frontendUrl =
        process.env.FRONTEND_URL || "https://bizpart24-fullstack.vercel.app";

      const { data, error } = await resend.emails.send({
        from: `System Notification <${FROM_EMAIL}>`,
        to: [toEmail],
        subject: `[ADMIN] Bukti Bayar Masuk - #${order.orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #111; padding: 18px 24px; display: flex; align-items: center; gap: 12px;">
              <h2 style="color: white; margin: 0; font-size: 18px;">BIZPART24 &mdash; Bukti Pembayaran Masuk</h2>
            </div>
            <div style="padding: 24px;">
              <p style="margin: 0 0 16px;">Pelanggan <strong>${order.customerName}</strong> baru saja mengunggah bukti transfer untuk pesanan:</p>

              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
                <tr style="background: #f9f9f9;">
                  <td style="padding: 8px 12px; color: #666;">ID Pesanan</td>
                  <td style="padding: 8px 12px; font-weight: bold;">#${order.orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; color: #666;">Nama</td>
                  <td style="padding: 8px 12px;">${order.customerName}</td>
                </tr>
                <tr style="background: #f9f9f9;">
                  <td style="padding: 8px 12px; color: #666;">No. Telepon</td>
                  <td style="padding: 8px 12px;">${order.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; color: #666;">Subtotal Produk</td>
                  <td style="padding: 8px 12px;">Rp ${order.itemsTotal.toLocaleString("id-ID")}</td>
                </tr>
                <tr style="background: #f9f9f9;">
                  <td style="padding: 8px 12px; color: #666;">Ongkos Kirim</td>
                  <td style="padding: 8px 12px;">Rp ${order.shippingCost.toLocaleString("id-ID")}</td>
                </tr>
                <tr style="border-top: 2px solid #eee;">
                  <td style="padding: 10px 12px; font-weight: bold; font-size: 16px;">Total Bayar</td>
                  <td style="padding: 10px 12px; font-weight: bold; font-size: 16px; color: #D92D20;">Rp ${order.grandTotal.toLocaleString("id-ID")}</td>
                </tr>
              </table>

              ${
                order.paymentProof
                  ? `
              <div style="margin-bottom: 24px;">
                <p style="font-weight: bold; margin-bottom: 10px;">Bukti Transfer:</p>
                <a href="${order.paymentProof}" target="_blank">
                  <img src="${order.paymentProof}" alt="Bukti Pembayaran" style="max-width: 100%; border-radius: 8px; border: 1px solid #eee;" />
                </a>
                <p style="font-size: 12px; color: #999; margin-top: 6px;">Klik gambar untuk melihat ukuran penuh</p>
              </div>
              `
                  : ""
              }

              <div style="text-align: center;">
                <a href="${frontendUrl}/admin/orders/${order.id}" style="display: inline-block; background-color: #111; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">Buka Detail Pesanan</a>
              </div>
            </div>
            <div style="background-color: #f5f5f5; padding: 14px 24px; text-align: center; font-size: 12px; color: #999;">
              &copy; ${new Date().getFullYear()} BIZPART24. Notifikasi Sistem.
            </div>
          </div>
        `,
      });

      if (error)
        console.error("MailService Error (Payment Proof Notification):", error);
      else
        console.log("MailService Success (Payment Proof Notification):", data);
    } catch (err) {
      console.error("MailService Exception (Payment Proof Notification):", err);
    }
  }

  // 5. Kirim Email ke Customer: Nomor Resi Dikirim
  static async sendTrackingNumberEmail(order: any) {
    try {
      if (!order.email) return;

      const { data, error } = await resend.emails.send({
        from: `BIZPART24 <${FROM_EMAIL}>`,
        to: [order.email],
        subject: order.trackingNumber
          ? `Pesanan #${order.orderId} Dikirim via ${order.courierType || "Kurir"} - Resi: ${order.trackingNumber}`
          : `Pesanan #${order.orderId} Sedang Dikirim via ${order.courierType || "Antar Sendiri"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #D92D20; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">BIZPART24</h1>
            </div>
            <div style="padding: 24px;">
              <h2 style="margin-top: 0;">Paket Anda Sedang Dalam Perjalanan! </h2>
              <p>Halo <strong>${order.customerName}</strong>,</p>
              <p>Pesanan <strong>#${order.orderId}</strong> Anda telah dikemas dan siap dikirim.</p>

              <div style="background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; color: #666;">Ekspedisi</td>
                    <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #111;">${order.courierType || "-"}</td>
                  </tr>
                  ${
                    order.trackingNumber
                      ? `
                  <tr>
                    <td style="padding: 6px 0; color: #666;">Nomor Resi</td>
                    <td style="padding: 6px 0; text-align: right;">
                      <span style="font-size: 18px; font-weight: bold; letter-spacing: 2px; color: #111;">${order.trackingNumber}</span>
                    </td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </div>

              ${
                order.trackingNumber
                  ? `<p>Gunakan nomor resi di atas untuk melacak paket Anda di website <strong>${order.courierType || "kurir"}</strong>.</p>`
                  : `<p>Paket Anda akan diantarkan langsung oleh tim kami. Kami akan menghubungi Anda untuk koordinasi pengiriman.</p>`
              }

              <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <h3 style="margin-top: 0; font-size: 14px; color: #666;">RINGKASAN PESANAN</h3>
                <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; color: #666;">Subtotal Produk</td>
                    <td style="padding: 4px 0; text-align: right;">Rp ${order.itemsTotal.toLocaleString("id-ID")}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #666;">Ongkos Kirim</td>
                    <td style="padding: 4px 0; text-align: right;">Rp ${order.shippingCost.toLocaleString("id-ID")}</td>
                  </tr>
                  <tr style="border-top: 1px solid #ddd;">
                    <td style="padding: 8px 0 4px; font-weight: bold;">Total Dibayar</td>
                    <td style="padding: 8px 0 4px; text-align: right; font-weight: bold; color: #D92D20;">Rp ${order.grandTotal.toLocaleString("id-ID")}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 13px; color: #666;">Terima kasih telah berbelanja di BIZPART24. Jika ada pertanyaan, hubungi kami via WhatsApp.</p>
            </div>
            <div style="background-color: #f5f5f5; padding: 14px; text-align: center; font-size: 12px; color: #999;">
              &copy; ${new Date().getFullYear()} BIZPART24. All rights reserved.
            </div>
          </div>
        `,
      });

      if (error) console.error("MailService Error (Tracking Number):", error);
      else console.log("MailService Success (Tracking Number):", data);
    } catch (err) {
      console.error("MailService Exception (Tracking Number):", err);
    }
  }

  // 6. Kirim Email ke Admin: Pelanggan Konfirmasi Barang Diterima
  static async sendOrderReceivedEmail(
    order: any,
    receiptImageUrl: string | null,
  ) {
    try {
      const { data, error } = await resend.emails.send({
        from: `BIZPART24 <${FROM_EMAIL}>`,
        to: [ADMIN_EMAIL],
        subject: `✅ Pesanan #${order.orderId} Telah Diterima oleh ${order.customerName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #059669; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">BIZPART24</h1>
            </div>
            <div style="padding: 24px;">
              <h2 style="margin-top: 0; color: #059669;">Pesanan Diterima! ✅</h2>
              <p>Pelanggan <strong>${order.customerName}</strong> telah mengkonfirmasi pesanan <strong>#${order.orderId}</strong> sudah diterima.</p>
              <p>Status pesanan sudah otomatis berubah ke <strong>Selesai</strong>.</p>

              <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <h3 style="margin-top: 0; font-size: 14px; color: #666;">DETAIL PESANAN</h3>
                <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; color: #666;">ID Pesanan</td>
                    <td style="padding: 4px 0; text-align: right; font-weight: bold;">#${order.orderId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #666;">Pelanggan</td>
                    <td style="padding: 4px 0; text-align: right;">${order.customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #666;">Email</td>
                    <td style="padding: 4px 0; text-align: right;">${order.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #666;">Telepon</td>
                    <td style="padding: 4px 0; text-align: right;">${order.phone}</td>
                  </tr>
                  <tr style="border-top: 1px solid #ddd;">
                    <td style="padding: 8px 0 4px; font-weight: bold;">Total Dibayar</td>
                    <td style="padding: 8px 0 4px; text-align: right; font-weight: bold; color: #059669;">Rp ${order.grandTotal.toLocaleString("id-ID")}</td>
                  </tr>
                </table>
              </div>

              ${
                receiptImageUrl
                  ? `
              <div style="margin: 20px 0;">
                <p style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">📷 Foto Bukti Penerimaan:</p>
                <img src="${receiptImageUrl}" alt="Bukti Penerimaan" style="max-width: 100%; border-radius: 8px; border: 1px solid #eee;" />
              </div>
              `
                  : '<p style="color: #999; font-size: 13px; font-style: italic;">Pelanggan tidak melampirkan foto bukti penerimaan.</p>'
              }

            </div>
            <div style="background-color: #f5f5f5; padding: 14px; text-align: center; font-size: 12px; color: #999;">
              &copy; ${new Date().getFullYear()} BIZPART24. All rights reserved.
            </div>
          </div>
        `,
      });

      if (error) console.error("MailService Error (Order Received):", error);
      else console.log("MailService Success (Order Received):", data);
    } catch (err) {
      console.error("MailService Exception (Order Received):", err);
    }
  }
}
