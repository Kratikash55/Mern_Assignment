import User from "../models/User.js";
import axios from "axios";

// ================= SIGNUP WITH OTP =================
export const signupWithOtp = async (req, res) => {

  try {

    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        message: "Email required",
      });
    }

    // Generate OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    console.log("✅ GENERATED OTP:", otp);
    console.log("👉 TARGET EMAIL:", email);

    // Find existing user
    let user = await User.findOne({ email });

    // Create or update user
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

    // Save user
    await user.save();

    console.log("✅ USER SAVED IN DB");

    // ================= BREVO API =================

    const senderEmail =
      process.env.EMAIL_USER;

    const brevoApiKey =
      process.env.EMAIL_PASS;

    // Check API key
    if (!brevoApiKey) {

      console.log("❌ BREVO API KEY MISSING");

      return res.status(500).json({
        message: "Brevo API key missing",
      });
    }

    console.log("👉 Sending email with Brevo...");

    // Send Email
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",

      {
        sender: {
          name: "Productr",
          email: senderEmail,
        },

        to: [
          {
            email: email,
          },
        ],

        subject: "Your OTP Code",

        htmlContent: `
          <div style="font-family:sans-serif;padding:20px;">
            <h2>Your OTP is: ${otp}</h2>
            <p>This OTP will expire in 5 minutes.</p>
          </div>
        `,
      },

      {
        headers: {
          accept: "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },

        timeout: 15000,
      }
    );

    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log(response.data);

    return res.status(200).json({
      message: "OTP sent to email",
    });

  } catch (error) {

    console.log("❌ SERVER ERROR:");

    console.log(
      error.response?.data || error.message
    );

    return res.status(500).json({
      message:
        error.response?.data?.message ||
        error.message,
    });
  }
};

// ================= VERIFY OTP =================
export const verifyOtp = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.otp = null;
    user.isVerified = true;

    await user.save();

    console.log("✅ USER VERIFIED");

    return res.status(200).json({
      message: "Signup successful",
    });

  } catch (error) {

    console.log("❌ VERIFY ERROR:");
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};