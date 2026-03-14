import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { protect } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.middleware";

const router = Router();
const orderController = new OrderController();

// Public
router.post(
  "/create",
  [
    body("customerName").notEmpty(),
    body("phone").notEmpty(),
    body("address").notEmpty(),
    body("items").isArray({ min: 1 }),
    validate,
  ],
  orderController.create,
);
router.post(
  "/upload-proof",
  upload.single("image"),
  orderController.uploadProof,
);

// Admin
router.get("/admin/analytics", protect, orderController.getAnalytics);
router.get("/admin/list", protect, orderController.getAll);
router.get("/admin/:id", protect, orderController.getByIdAdmin);
router.put("/admin/:id/ongkir", protect, orderController.updateShipping);
router.put("/admin/:id/status", protect, orderController.updateStatus);
router.put("/admin/:id/resi", protect, orderController.updateTrackingNumber);

// Public: Pelanggan konfirmasi barang sudah diterima (opsional lampirkan foto)
router.post(
  "/confirm-received",
  upload.single("image"),
  orderController.confirmReceived,
);

// ⚠️ Dynamic param route LAST — must come after all specific paths to avoid swallowing them
router.get("/:orderId", orderController.getByOrderId);

export default router;
