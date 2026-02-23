import { MailService } from './src/services/mail.service';
import dotenv from 'dotenv';

dotenv.config();

const testOrder = {
  orderId: 'INV-TEST-0002',
  customerName: 'John Doe (Test)',
  email: 'c0478592@gmail.com', // User email
  phone: '08123456789',
  address: 'Jl. Test No. 123',
  items: [
    {
      name: 'Kampas Rem Depan',
      qty: 1,
      subtotal: 150000
    }
  ],
  itemsTotal: 150000,
  shippingCost: 20000,
  grandTotal: 170000
};

async function testResend() {
  console.log('--- MENGIRIM EMAIL KE USER (Invoice Awal / Menunggu Ongkir) ---');
  await MailService.sendOrderCreatedEmail(testOrder);
  
  console.log('\n--- MENGIRIM EMAIL KE ADMIN (Pesanan Masuk) ---');
  // Dalam mail.service.ts, admin email diambil dari process.env.ADMIN_EMAIL yang sudah diset ke yawwnan01@gmail.com
  await MailService.sendAdminNewOrderEmail(testOrder);
  
  console.log('\n--- MENGIRIM EMAIL KE USER (Ongkir Diupdate / Siap Bayar) ---');
  await MailService.sendShippingUpdatedEmail(testOrder);
  
  console.log('\nSelesai testing.');
}

testResend();
