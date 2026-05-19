import User from "../models/User.js";
import axios from "axios";

export const signupWithOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("✅ GENERATED OTP:", otp);
    console.log("👉 TARGET EMAIL:", email);

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
    console.log("✅ USER SAVED IN DB");

    // Safety Checks for Env Variables
    const senderEmail = process.env.EMAIL_USER || "kratikasharma359@gmail.com";
    const brevoApiKey = process.env.EMAIL_PASS;

    if (!brevoApiKey) {
      console.log("❌ ERROR: EMAIL_PASS (Brevo API Key) is missing in Env Variables!");
      return res.status(500).json({ message: "Backend configuration error: API Key missing" });
    }

    console.log("👉 Triggering Brevo API request...");

    // ================= BREVO REST API PAYLOAD =================
    try {
      await axios.post(
        "https://brevo.com",
        {
          sender: { name: "Productr", email: senderEmail },
          to: [{ email: email }],
          subject: "Your OTP Code",
          htmlContent: `
            <div style="font-family:sans-serif;padding:20px;">
              <h2>Your OTP is: ${otp}</h2>
              <p>This OTP will expire in 5 minutes.</p>
            </div>
          `
        },
        {
          headers: {
            "accept": "application/json",
            "api-key": brevoApiKey,
            "content-type": "application/json"
          }
        }
      );
      
      console.log("✅ EMAIL SENT SUCCESSFULLY VIA BREVO HTTP API");
      return res.status(200).json({ message: "OTP sent to email" });

    } catch (brevoError) {
      console.log("❌ BREVO API REJECTED REQUEST:", brevoError.response?.data || brevoError.message);
      return res.status(500).json({ 
        message: "Brevo email rejected", 
        details: brevoError.response?.data?.message || brevoError.message 
      });
    }

  } catch (error) {
    console.log("❌ GLOBAL SERVER ERROR:", error);
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
