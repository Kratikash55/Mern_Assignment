import User from "../models/User.js";
import axios from "axios";
import nodemailer from "nodemailer";

// ================= SIGNUP WITH OTP =================
export const signupWithOtp = async (req, res) => {

  try {

    const { email, phone } = req.body;

    // Validation
    if (!email && !phone) {
      return res.status(400).json({
        message: "Email or phone required",
      });
    }

    // Generate OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    console.log("✅ GENERATED OTP:", otp);

    // Find existing user
    let user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    // Create or update user
    if (!user) {

      user = new User({
        email: email || "",
        phone: phone || "",
        otp,
        otpExpires: Date.now() + 5 * 60 * 1000,
      });

    } else {

      user.otp = otp;
      user.otpExpires = Date.now() + 5 * 60 * 1000;
    }

    // Save user
    await user.save();

    console.log("✅ USER SAVED");

    // ================= EMAIL OTP =================
    if (email) {

      console.log("📩 EMAIL:", email);

      // Create transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,

        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Verify transporter
      await transporter.verify();

      console.log("✅ SMTP CONNECTED");

      // Send mail
      const info = await transporter.sendMail({
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
      console.log(info);

      return res.status(200).json({
        message: "OTP sent to email",
      });
    }

    // ================= PHONE OTP =================
    if (phone) {

      console.log("📱 PHONE:", phone);

      try {

        await axios.post(
          "https://www.fast2sms.com/dev/bulkV2",
          {},
          {
            headers: {
              authorization:
                process.env.FAST2SMS_API_KEY,
            },

            params: {
              route: "v3",
              sender_id: "TXTIND",
              message: `Your OTP is ${otp}`,
              language: "english",
              numbers: phone,
            },
          }
        );

        console.log("✅ OTP SMS SENT");

        return res.status(200).json({
          message: "OTP sent to phone",
        });

      } catch (smsError) {

        console.log("❌ SMS ERROR:", smsError);

        return res.status(500).json({
          message: "Failed to send phone OTP",
        });
      }
    }

  } catch (error) {

    console.log("❌ SERVER ERROR:");
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= VERIFY OTP =================
export const verifyOtp = async (req, res) => {

  try {

    const { email, phone, otp } = req.body;

    console.log("✅ VERIFY OTP:", otp);

    const user = await User.findOne({
      $or: [{ email }, { phone }],
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