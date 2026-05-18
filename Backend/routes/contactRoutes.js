import express from "express";
import {
  signupWithOtp,
  verifyOtp,
} from "../controller/contactController.js";

const router = express.Router();

router.post("/signup", signupWithOtp);
router.post("/verify-otp", verifyOtp);

export default router;