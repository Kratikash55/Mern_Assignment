import User from "../models/User.js";
import axios from "axios";

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

    // Find existing user
    let user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    // Create user if not exists
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

    console.log("✅ User Saved");
    console.log("✅ Generated OTP:", otp);

    // ================= EMAIL LOGIN =================
    if (email) {

      return res.status(200).json({
        message: "OTP sent to email",
        otp,
      });
    }

    // ================= PHONE LOGIN =================
    if (phone) {

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

        console.log("✅ OTP SMS Sent");

        return res.status(200).json({
          message: "OTP sent to phone",
        });

      } catch (smsError) {

        console.log("SMS ERROR:", smsError);

        return res.status(500).json({
          message: "Failed to send phone OTP",
        });
      }
    }

  } catch (error) {

    console.log("SERVER ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= VERIFY OTP =================
export const verifyOtp = async (req, res) => {

  try {

    const { email, phone, otp } = req.body;

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

    return res.status(200).json({
      message: "Signup successful",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};