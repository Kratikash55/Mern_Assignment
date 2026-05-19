import User from "../models/User.js";
import * as sibApi from "@getbrevo/brevo";

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
    console.log("✅ USER SAVED");

    // ================= BREVO HTTP API CONFIG (NO PORTS REQUIRED) =================
    let defaultClient = sibApi.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.EMAIL_PASS; // Aapki Brevo SMTP/API Key yahan kaam karegi

    let apiInstance = new sibApi.TransactionalEmailsApi();
    let sendSmtpEmail = new sibApi.SendSmtpEmail();

    sendSmtpEmail.subject = "Your OTP Code";
    sendSmtpEmail.htmlContent = `
      <div style="font-family:sans-serif;padding:20px;">
        <h2>Your OTP is: ${otp}</h2>
        <p>This OTP will expire in 5 minutes.</p>
      </div>
    `;
    sendSmtpEmail.sender = { "name": "Productr", "email": process.env.EMAIL_USER };
    sendSmtpEmail.to = [{ "email": email }];

    // API Call se bina kisi port delay ke instantly email send hoga
    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("✅ EMAIL SENT SUCCESSFULLY VIA BREVO API");
    return res.status(200).json({ message: "OTP sent to email" });

  } catch (error) {
    console.log("❌ SERVER ERROR DURING MAIL API:", error);
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
