import User from "../models/User.js";
import nodemailer from "nodemailer";


// Signup with OTP
export const signupWithOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      user = new User({ email, phone, otp, otpExpires: Date.now() + 5 * 60 * 1000 });
    } else {
      user.otp = otp;
      user.otpExpires = Date.now() + 5 * 60 * 1000;
    }
    await user.save();

    // Email OTP
    if (email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Productr" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Productr OTP Code",
        html: `<h2>Your OTP is ${otp}</h2><p>This code will expire in 5 minutes.</p>`,
      });

      return res.json({ message: "OTP sent to email" });
    }

    // Phone OTP (Fast2SMS)
    if (phone) {
      await axios.post("https://www.fast2sms.com/dev/bulkV2", {}, {
        headers: { authorization: process.env.FAST2SMS_API_KEY },
        params: {
          route: "v3",
          sender_id: "TXTIND",
          message: `Your OTP is ${otp}`,
          language: "english",
          numbers: phone,
        },
      });

      return res.json({ message: "OTP sent to phone" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    const user = await User.findOne({ $or: [{ email }, { phone }] });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (Date.now() > user.otpExpires) return res.status(400).json({ message: "OTP expired" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.otp = null;
    user.isVerified = true;
    await user.save();

    return res.json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
