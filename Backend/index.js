import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import contactRoutes from "./routes/contactRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import path from "path";

dotenv.config();
const app = express();

// ✅ Middlewares
app.use(cors());

app.use(express.json());

// ✅ Routes
app.use("/api/products", productRoutes);
app.use("/api/user", contactRoutes);

// ✅ Static uploads folder (safe path resolve)
app.use("/uploads", express.static(path.resolve("uploads")));

const PORT = process.env.PORT || 8000;

// ✅ Connect DB and start server
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1); // stop app if DB fails
  }
};

connectDb();
