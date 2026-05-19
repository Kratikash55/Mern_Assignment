import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import contactRoutes from "./routes/contactRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import path from "path";

dotenv.config();
const app = express();

// ✅ 1. Middlewares (Hamesha upar)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-assignment-1-9b24.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ 2. Routes
app.use("/api/products", productRoutes);
app.use("/api/user", contactRoutes);

// ✅ 3. Static uploads folder
app.use("/uploads", express.static(path.resolve("uploads")));

const PORT = process.env.PORT || 8000;

// ✅ 4. Server ko pehle start karein (Taki Render connection fail na kare)
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// ✅ 5. Database ko background me connect hone dein
const connectDb = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL environment variable is missing!");
    }
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    // Server ko kill nahi karenge taki logs chalu rahein
  }
};

connectDb();
