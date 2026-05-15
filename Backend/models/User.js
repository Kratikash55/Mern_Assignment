import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true }, // optional
  phone: { type: String, unique: true, sparse: true }, // optional
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false }
});


export default mongoose.model("User", userSchema);
