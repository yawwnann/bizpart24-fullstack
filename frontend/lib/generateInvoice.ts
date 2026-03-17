import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type OrderItem = {
  name: string;
  qty: number;
  price: number;
  subtotal: number;
};

type InvoiceOrder = {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  itemsTotal: number;
  shippingCost: number;
  grandTotal: number;
  status: string;
  items: OrderItem[];
  createdAt?: string;
};

const STATUS_LABEL: Record<string, string> = {
  menunggu_ongkir: "Menunggu Konfirmasi Ongkir",
  menunggu_pembayaran: "Menunggu Pembayaran",
  diproses: "Sedang Diproses",
  dikirim: "Sedang Dikirim",
  selesai: "Selesai",
  batal: "Dibatalkan",
};

const IDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

export async function generateInvoicePDF(order: InvoiceOrder): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;

  /* ─── Load logo as base64 ─────────────────────────────── */
  let logoDataUrl: string | null = null;
  let logoW = 22;
  let logoH = 22;
  try {
    const resp = await fetch("/logo.png");
    const blob = await resp.blob();
    logoDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    // Detect natural dimensions to preserve aspect ratio
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const maxH = 22;
        const maxW = 40;
        const ratio = img.naturalWidth / img.naturalHeight;
        if (ratio >= 1) {
          logoW = Math.min(maxW, maxH * ratio);
          logoH = logoW / ratio;
        } else {
          logoH = maxH;
          logoW = logoH * ratio;
        }
        resolve();
      };
      img.onerror = () => resolve();
      img.src = logoDataUrl!;
    });
  } catch {
    // logo optional — continue without it
  }

  /* ─── HEADER BAND ─────────────────────────────────────── */
  // Dark gradient band
  doc.setFillColor(17, 17, 17); // #111
  doc.rect(0, 0, pageW, 38, "F");

  // Accent stripe
  doc.setFillColor(217, 45, 32); // #D92D20
  doc.rect(0, 34, pageW, 4, "F");

  // Logo
  if (logoDataUrl) {
    try {
      const logoY = 8 + (22 - logoH) / 2;
      doc.addImage(logoDataUrl, "PNG", margin, logoY, logoW, logoH);
    } catch {/* ignore */}
  }

  // Brand name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  const textX = logoDataUrl ? margin + logoW + 4 : margin;
  doc.text("BIZPART24", textX, 18);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  doc.text("www.bizpart24.com", textX, 24);

  // INVOICE label (top right)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageW - margin, 16, { align: "right" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text(`#${order.orderId}`, pageW - margin, 23, { align: "right" });

  /* ─── SUB-HEADER: date + status ─────────────────────────── */
  let curY = 46;

  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Tanggal: ${dateStr}`, margin, curY);

  // Status badge
  const statusText = STATUS_LABEL[order.status] ?? order.status;
  const badgeX = pageW - margin;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  const badgeColor =
    order.status === "selesai"
      ? [5, 150, 105]
      : order.status === "batal"
      ? [220, 50, 50]
      : order.status === "menunggu_pembayaran"
      ? [180, 110, 0]
      : [60, 100, 200];
  doc.setTextColor(...(badgeColor as [number, number, number]));
  doc.text(statusText.toUpperCase(), badgeX, curY, { align: "right" });

  curY += 8;

  /* ─── DIVIDER ────────────────────────────────────────────── */
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.3);
  doc.line(margin, curY, pageW - margin, curY);
  curY += 6;

  /* ─── CUSTOMER INFO BOX ──────────────────────────────────── */
  // Light background card
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, curY, contentW, 34, 3, 3, "F");
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, curY, contentW, 34, 3, 3, "S");

  const colW = contentW / 2;
  const innerY = curY + 6;

  // Left column
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  doc.text("NAMA PELANGGAN", margin + 6, innerY);
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text(order.customerName, margin + 6, innerY + 5);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  doc.text("EMAIL", margin + 6, innerY + 12);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  doc.text(order.email || "—", margin + 6, innerY + 17);

  // Right column
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  doc.text("NO. TELEPON", margin + colW + 6, innerY);
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text(order.phone, margin + colW + 6, innerY + 5);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  doc.text("ALAMAT PENGIRIMAN", margin + colW + 6, innerY + 12);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  const addressLines = doc.splitTextToSize(order.address, colW - 10);
  doc.text(addressLines.slice(0, 2), margin + colW + 6, innerY + 17);

  curY += 40;

  /* ─── ITEMS TABLE ────────────────────────────────────────── */
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Detail Pesanan", margin, curY);
  curY += 4;

  autoTable(doc, {
    startY: curY,
    margin: { left: margin, right: margin },
    head: [["#", "Nama Produk", "Qty", "Harga Satuan", "Subtotal"]],
    body: order.items.map((item, idx) => [
      idx + 1,
      item.name,
      item.qty,
      IDR(item.price),
      IDR(item.subtotal),
    ]),
    headStyles: {
      fillColor: [17, 17, 17],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [50, 50, 50],
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: "auto" },
      2: { cellWidth: 16, halign: "center" },
      3: { cellWidth: 36, halign: "right" },
      4: { cellWidth: 38, halign: "right" },
    },
    styles: {
      lineColor: [229, 231, 235],
      lineWidth: 0.3,
    },
    tableLineColor: [229, 231, 235],
    tableLineWidth: 0.3,
  });

  // Get Y after table
  const afterTable = (doc as any).lastAutoTable.finalY + 4;
  curY = afterTable;

  /* ─── TOTALS BOX ─────────────────────────────────────────── */
  const totalsW = 80;
  const totalsX = pageW - margin - totalsW;

  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.4);
  doc.roundedRect(totalsX, curY, totalsW, 34, 3, 3, "FD");

  const rowH = 8;
  let tY = curY + 7;

  // Subtotal row
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Subtotal Produk", totalsX + 5, tY);
  doc.setTextColor(50, 50, 50);
  doc.text(IDR(order.itemsTotal), totalsX + totalsW - 5, tY, { align: "right" });
  tY += rowH;

  // Shipping row
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Ongkos Kirim", totalsX + 5, tY);
  doc.setTextColor(50, 50, 50);
  if (order.shippingCost > 0) {
    doc.text(IDR(order.shippingCost), totalsX + totalsW - 5, tY, { align: "right" });
  } else {
    doc.setTextColor(180, 100, 0);
    doc.setFontSize(7.5);
    doc.text("Menunggu konfirmasi", totalsX + totalsW - 5, tY, { align: "right" });
  }
  tY += rowH;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(totalsX + 5, tY - 2, totalsX + totalsW - 5, tY - 2);

  // Grand total
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text("Total Bayar", totalsX + 5, tY + 3);
  doc.setTextColor(217, 45, 32); // brand red
  doc.text(IDR(order.grandTotal), totalsX + totalsW - 5, tY + 3, { align: "right" });

  curY = tY + 12;


  /* ─── FOOTER ─────────────────────────────────────────────── */
  const footerY = pageH - 14;
  doc.setFillColor(17, 17, 17);
  doc.rect(0, footerY - 4, pageW, 20, "F");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 160, 160);
  doc.text(
    "Terima kasih telah berbelanja di BIZPART24.",
    pageW / 2,
    footerY + 2,
    { align: "center" }
  );
  doc.setTextColor(120, 120, 120);
  doc.text(
    `© ${new Date().getFullYear()} BIZPART24 — www.bizpart24.com`,
    pageW / 2,
    footerY + 7,
    { align: "center" }
  );

  /* ─── SAVE ───────────────────────────────────────────────── */
  doc.save(`Invoice-${order.orderId}.pdf`);
}
