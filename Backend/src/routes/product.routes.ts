import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { protect } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.middleware";

const router = Router();
const productController = new ProductController();

// Public
router.get("/", productController.getAll);
router.get("/:id", productController.getById);

// Admin
router.post(
  "/",
  protect,
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "details", maxCount: 10 },
  ]),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("description").notEmpty().withMessage("Description is required"),
    body("stock").isNumeric().withMessage("Stock must be a number"),
    validate,
  ],
  productController.create,
);

router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "details", maxCount: 10 },
  ]),
  productController.update,
);
router.delete("/:id", protect, productController.delete);
router.delete("/:id/images/:imageId", protect, productController.deleteImage);

export default router;
