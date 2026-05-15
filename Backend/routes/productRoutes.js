import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  togglePublish,   // ✅ new controller
} from "../controller/productController.js";
import upload from "../middleware/uploads.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

// ✅ Multer middleware for image upload
router.post("/", upload.single("image"), createProduct);

router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

// ✅ Publish toggle route
router.put("/:id/publish", togglePublish);

export default router;
