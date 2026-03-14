import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";
import { uploadToCloudinary } from "../utils/cloudinary";
import {
  generateWhatsAppLink,
  generateTrackingWhatsAppLink,
} from "../utils/whatsapp";
import { MailService } from "../services/mail.service";

export class OrderController {
  // Public
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customerName, name, email, phone, address, items } = req.body;
      const finalCustomerName = customerName || name;

      // ✅ Fix N+1: Fetch all products in a single query instead of one per item
      const productIds = items.map((item: any) => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });
      const productMap = new Map(products.map((p) => [p.id, p]));

      let itemsTotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = productMap.get(item.productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Produk ${item.productId} tidak ditemukan`,
          });
        }
        if (product.stock < item.qty) {
          return res.status(400).json({
            success: false,
            message: `Stok tidak cukup untuk ${product.name}`,
          });
        }
        const subtotal = product.price * item.qty;
        itemsTotal += subtotal;
        orderItemsData.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: item.qty,
          subtotal,
        });
      }

      // Generate Order ID (INV-YYYY-XXXX)
      const date = new Date();
      const year = date.getFullYear();
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year + 1, 0, 1);
      const count = await prisma.order.count({
        where: { createdAt: { gte: startOfYear, lt: endOfYear } },
      });
      const orderId = `INV-${year}-${(count + 1).toString().padStart(4, "0")}`;

      // Create Order with Nested Items
      const order = await prisma.order.create({
        data: {
          orderId,
          customerName: finalCustomerName,
          email,
          phone,
          address,
          itemsTotal,
          shippingCost: 0,
          grandTotal: itemsTotal,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });

      // Send Emails (Non-blocking)
      MailService.sendOrderCreatedEmail(order);
      MailService.sendAdminNewOrderEmail(order);

      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  };

  public getByOrderId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const orderId = String(req.params.orderId);
      const order = await prisma.order.findUnique({
        where: { orderId },
        include: { items: true },
      });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  };

  public uploadProof = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { orderId } = req.body;
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Payment proof image is required" });
      }

      const order = await prisma.order.findUnique({ where: { orderId } });
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      const imageUrl = await uploadToCloudinary(req.file.buffer, "orders");

      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentProof: imageUrl as string,
          // status: 'diproses' // Optional
        },
        include: { items: true },
      });

      // Notify admin via email (include proof image link)
      MailService.sendPaymentProofEmail(updatedOrder);

      res.json({
        success: true,
        message: "Proof uploaded",
        data: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  };

  // Admin
  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { items: true },
      });
      res.json({ success: true, count: orders.length, data: orders });
    } catch (error) {
      next(error);
    }
  };

  public getByIdAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = String(req.params.id);
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  };

  public updateShipping = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { shippingCost } = req.body;
      const id = String(req.params.id);
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      const shipping = Number(shippingCost);
      const grandTotal = order.itemsTotal + shipping;

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          shippingCost: shipping,
          grandTotal: grandTotal,
          status: "menunggu_pembayaran",
        },
        include: { items: true },
      });

      // Send Email to Customer (awaited so errors are visible in logs)
      try {
        await MailService.sendShippingUpdatedEmail(updatedOrder);
      } catch (mailErr) {
        console.error(
          "[updateShipping] sendShippingUpdatedEmail failed:",
          mailErr,
        );
      }

      // Send WhatsApp link for convenience
      const waLink = generateWhatsAppLink(updatedOrder);

      res.json({
        success: true,
        data: updatedOrder,
        whatsappLink: waLink,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { status } = req.body;

      // Check if order exists first to handle 404 cleanly (Prisma throws if update fails on ID usually, but findUnique is safer for logic)
      const id = String(req.params.id);
      const existing = await prisma.order.findUnique({ where: { id } });
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      const order = await prisma.order.update({
        where: { id },
        data: { status },
        include: { items: true },
      });

      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  };

  public updateTrackingNumber = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { trackingNumber, courierType } = req.body;
      const id = String(req.params.id);

      if (!courierType) {
        return res
          .status(400)
          .json({ success: false, message: "Jenis ekspedisi wajib diisi" });
      }

      const existing = await prisma.order.findUnique({ where: { id } });
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      const updateData: any = { courierType, status: "dikirim" };
      if (trackingNumber && trackingNumber.trim()) {
        updateData.trackingNumber = trackingNumber.trim();
      }

      const order = await prisma.order.update({
        where: { id },
        data: updateData,
        include: { items: true },
      });

      // Notify customer via email
      MailService.sendTrackingNumberEmail(order);

      const waLink = generateTrackingWhatsAppLink(order);

      res.json({ success: true, data: order, whatsappLink: waLink });
    } catch (error) {
      next(error);
    }
  };

  public confirmReceived = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { orderId } = req.body;

      if (!orderId) {
        return res
          .status(400)
          .json({ success: false, message: "orderId wajib diisi" });
      }

      const existing = await prisma.order.findUnique({
        where: { orderId },
        include: { items: true },
      });

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Pesanan tidak ditemukan" });
      }

      if (existing.status !== "dikirim") {
        return res.status(400).json({
          success: false,
          message: "Konfirmasi hanya bisa dilakukan saat status Dikirim",
        });
      }

      // Upload foto bukti penerimaan jika ada
      let receiptImageUrl: string | null = null;
      if (req.file) {
        receiptImageUrl = (await uploadToCloudinary(
          req.file.buffer,
          "receipts",
        )) as string;
      }

      // Set status selesai
      const order = await prisma.order.update({
        where: { orderId },
        data: { status: "selesai" },
        include: { items: true },
      });

      // Kirim email notifikasi ke admin
      MailService.sendOrderReceivedEmail(order, receiptImageUrl);

      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  };

  // Admin Analytics
  public getAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const now = new Date();

      // Last 30 days range
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 29);
      thirtyDaysAgo.setHours(0, 0, 0, 0);

      // This month range
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
      );
      const endOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
      );

      // --- Fetch all data in parallel ---
      const [
        allOrders,
        ordersThisMonth,
        ordersLastMonth,
        topProductsRaw,
        lowStockProducts,
      ] = await Promise.all([
        // All orders from last 30 days
        prisma.order.findMany({
          where: { createdAt: { gte: thirtyDaysAgo } },
          select: {
            createdAt: true,
            grandTotal: true,
            status: true,
            email: true,
          },
          orderBy: { createdAt: "asc" },
        }),
        // This month orders
        prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
        // Last month orders
        prisma.order.count({
          where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        }),
        // Top selling products by qty (aggregate)
        prisma.orderItem.groupBy({
          by: ["productId", "name"],
          _sum: { qty: true, subtotal: true },
          orderBy: { _sum: { qty: "desc" } },
          take: 5,
        }),
        // Low stock products
        prisma.product.findMany({
          where: { stock: { lte: 5 } },
          select: { id: true, name: true, stock: true },
          orderBy: { stock: "asc" },
          take: 10,
        }),
      ]);

      // --- Revenue & Orders per day (last 30 days) ---
      const dailyMap: Record<string, { revenue: number; orders: number }> = {};
      for (let i = 0; i < 30; i++) {
        const d = new Date(thirtyDaysAgo);
        d.setDate(thirtyDaysAgo.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        dailyMap[key] = { revenue: 0, orders: 0 };
      }
      for (const order of allOrders) {
        const key = new Date(order.createdAt).toISOString().slice(0, 10);
        if (dailyMap[key]) {
          dailyMap[key].orders += 1;
          if (order.status === "selesai") {
            dailyMap[key].revenue += order.grandTotal;
          }
        }
      }
      const dailyData = Object.entries(dailyMap).map(([date, v]) => ({
        date,
        label: new Date(date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
        revenue: v.revenue,
        orders: v.orders,
      }));

      // --- Orders by status ---
      const statusCount: Record<string, number> = {};
      for (const order of allOrders) {
        statusCount[order.status] = (statusCount[order.status] || 0) + 1;
      }
      const ordersByStatus = Object.entries(statusCount).map(
        ([status, count]) => ({
          status,
          count,
        }),
      );

      // --- Summary stats ---
      const totalRevenue30 = allOrders
        .filter((o) => o.status === "selesai")
        .reduce((s, o) => s + o.grandTotal, 0);
      const uniqueCustomers = new Set(allOrders.map((o) => o.email)).size;
      const completedOrders = allOrders.filter(
        (o) => o.status === "selesai",
      ).length;
      const avgOrderValue =
        completedOrders > 0 ? totalRevenue30 / completedOrders : 0;

      const orderGrowth =
        ordersLastMonth > 0
          ? Math.round(
              ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100,
            )
          : 100;

      res.json({
        success: true,
        data: {
          summary: {
            revenue30Days: totalRevenue30,
            orders30Days: allOrders.length,
            ordersThisMonth,
            ordersLastMonth,
            orderGrowth,
            uniqueCustomers,
            avgOrderValue,
            lowStockCount: lowStockProducts.length,
          },
          dailyData,
          ordersByStatus,
          topProducts: topProductsRaw.map((p) => ({
            name: p.name,
            qty: p._sum.qty ?? 0,
            revenue: p._sum.subtotal ?? 0,
          })),
          lowStockProducts,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
