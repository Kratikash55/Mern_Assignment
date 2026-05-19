import User from "../models/User.js";
import nodemailer from "nodemailer"; // 1. कमेंट हटा दिया गया है

export const signupWithOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("✅ GENERATED OTP:", otp);

    // Find existing user or create new
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        otp,
        otpExpires: Date.now() + 5 * 60 * 1000,
      });
    } else {
      user.otp = otp;
      user.otpExpires = Date.now() + 5 * 60 * 1000;
    }

    await user.save();
    console.log("✅ USER SAVED");

    // ================= EMAIL OTP =================
    
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", 
      port: 465,             
      secure: true,          
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    await transporter.sendMail({
      from: `"Productr" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family:sans-serif;padding:20px;">
          <h2>Your OTP is: ${otp}</h2>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `,
    });

    console.log("✅ EMAIL SENT SUCCESSFULLY");

    
    return res.status(200).json({ message: "OTP sent to email" });

  } catch (error) {
    console.log("❌ SERVER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= VERIFY OTP =================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (Date.now() > user.otpExpires)
      return res.status(400).json({ message: "OTP expired" });
    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    user.otp = null;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    console.log("❌ VERIFY ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
