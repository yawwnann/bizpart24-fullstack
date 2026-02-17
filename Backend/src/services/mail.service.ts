import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bizsparepart24.com'; // Change to real admin email

export class MailService {

  // 1. Kirim Email ke Customer: Pesanan Dibuat (Menunggu Ongkir)
  static async sendOrderCreatedEmail(order: any) {
    try {
      if (!order.email) return;

      const { data, error } = await resend.emails.send({
        from: `BIZSPAREPART24 <${FROM_EMAIL}>`,
        to: [order.email],
        subject: `Invoice #${order.orderId} - Menunggu Konfirmasi Ongkir`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #D92D20; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">BIZSPAREPART24</h1>
            </div>
            <div style="padding: 20px;">
              <h2>Terima Kasih atas Pesanan Anda!</h2>
              <p>Halo <strong>${order.customerName}</strong>,</p>
              <p>Pesanan Anda <strong>#${order.orderId}</strong> telah kami terima.</p>
              <p>Saat ini Admin kami sedang menghitung ongkos kirim ke alamat Anda. Mohon tunggu email selanjutnya untuk total tagihan lengkap.</p>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Detail Pesanan:</h3>
                <ul style="padding-left: 20px;">
                  ${order.items.map((item: any) => `<li>${item.name} x ${item.qty} - Rp ${item.subtotal.toLocaleString('id-ID')}</li>`).join('')}
                </ul>
                <p><strong>Subtotal Produk: Rp ${order.itemsTotal.toLocaleString('id-ID')}</strong></p>
                <p><em>Ongkos Kirim: Menunggu Konfirmasi Admin</em></p>
              </div>

              <p>Jika ada pertanyaan, silakan hubungi kami via WhatsApp.</p>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
              &copy; ${new Date().getFullYear()} BIZSPAREPART24. All rights reserved.
            </div>
          </div>
        `,
      });

      if (error) {
        console.error('MailService Error (User Order Created):', error);
      } else {
        console.log('MailService Success (User Order Created):', data);
      }
    } catch (err) {
      console.error('MailService Exception:', err);
    }
  }

  // 2. Kirim Email ke Admin: Pesanan Baru Masuk
  static async sendAdminNewOrderEmail(order: any) {
    try {
      // In production, use real admin email
      // For standard 'onboarding@resend.dev', you can only send to verified email (usually yourself)
      // So ensure ADMIN_EMAIL is your verified email in Resend dashboard
      const toEmail = process.env.ADMIN_EMAIL || 'your_verified_email@example.com'; 

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

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
               ${order.items.map((item: any) => `<li>${item.name} x ${item.qty}</li>`).join('')}
            </ul>

            <div style="margin-top: 20px;">
              <a href="${frontendUrl}/admin/orders/${order._id}" style="background-color: #D92D20; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Input Ongkir Sekarang</a>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error('MailService Error (Admin Notification):', error);
      }
    } catch (err) {
      console.error('MailService Exception:', err);
    }
  }

  // 3. Kirim Email ke Customer: Ongkir Diupdate (Siap Bayar)
  static async sendShippingUpdatedEmail(order: any) {
    try {
      if (!order.email) return;

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

      const { data, error } = await resend.emails.send({
        from: `BIZSPAREPART24 <${FROM_EMAIL}>`,
        to: [order.email],
        subject: `Tagihan Updated #${order.orderId} - Silakan Lakukan Pembayaran`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #D92D20; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">BIZSPAREPART24</h1>
            </div>
            <div style="padding: 20px;">
              <h2>Total Tagihan Anda Telah Diupdate!</h2>
              <p>Halo <strong>${order.customerName}</strong>,</p>
              <p>Admin kami telah menghitung ongkos kirim untuk pesanan <strong>#${order.orderId}</strong>.</p>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Rincian Pembayaran:</h3>
                <table style="width: 100%;">
                  <tr>
                    <td>Subtotal Produk:</td>
                    <td style="text-align: right;">Rp ${order.itemsTotal.toLocaleString('id-ID')}</td>
                  </tr>
                  <tr>
                    <td>Ongkos Kirim:</td>
                    <td style="text-align: right;">Rp ${order.shippingCost.toLocaleString('id-ID')}</td>
                  </tr>
                  <tr>
                    <td colspan="2"><hr style="border: 0; border-top: 1px solid #ddd; margin: 10px 0;"></td>
                  </tr>
                  <tr style="font-weight: bold; font-size: 18px;">
                    <td>Total Bayar:</td>
                    <td style="text-align: right; color: #D92D20;">Rp ${order.grandTotal.toLocaleString('id-ID')}</td>
                  </tr>
                </table>
              </div>

              <h3>Instruksi Pembayaran:</h3>
              <p>Silakan transfer total pembayaran ke rekening berikut:</p>
              <div style="border: 1px dashed #ccc; padding: 10px; background-color: #fff;">
                <p style="margin: 5px 0;"><strong>BCA: 1234567890</strong></p>
                <p style="margin: 5px 0;"><strong>Mandiri: 0987654321</strong></p>
                <p style="margin: 5px 0;">Atas Nama: <strong>PT BIZSPAREPART24</strong></p>
              </div>

              <p style="margin-top: 20px;">Setelah transfer, silakan konfirmasi pembayaran Anda disini:</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${frontendUrl}/payment" style="background-color: #D92D20; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Konfirmasi Pembayaran</a>
              </div>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
              &copy; ${new Date().getFullYear()} BIZSPAREPART24. All rights reserved.
            </div>
          </div>
        `,
      });

      if (error) {
        console.error('MailService Error (User Shipping Update):', error);
      } else {
        console.log('MailService Success (User Shipping Update):', data);
      }
    } catch (err) {
      console.error('MailService Exception:', err);
    }
  }
}
