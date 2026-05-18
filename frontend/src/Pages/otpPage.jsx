import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OtpPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [counter, setCounter] = useState(20);
  const [error, setError] = useState(""); // ✅ error state
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const phone = location.state?.phone;

  // Countdown logic
  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  // Handle OTP input
  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // ✅ Clear error when user starts typing again
    if (error) setError("");

    // Auto focus next box
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace → move to previous box
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Submit OTP
  const handleSubmit = async () => {
    const finalOtp = otp.join("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/verify-otp`, {
        email,
        phone,
        otp: finalOtp,
      });

      if (res.data.message === "Signup successful") {
        navigate("/dashboard");
      } else {
        setError("Please enter a valid OTP"); // ✅ show red text + red border
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error verifying OTP");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      await axios.post("http://localhost:8000/api/user/signup", {
        email,
        phone,
      });
      setCounter(20);
      setError(""); // ✅ clear error when resend
    } catch (err) {
      setError("Error resending OTP" , err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f4f4]">
      {/* Left Section */}
      <div className="ml-8 mt-8 rounded-[32px] overflow-hidden">
        <div className="h-full rounded-sm bg-cover bg-center relative">
          <div className="flex items-center justify-center h-full">
            <div className="w-[690px] h-[960px] ml-8 mt-8 mb-8 rounded-[32px] border border-gray-300 overflow-hidden relative">
              <img
                src="/assets/Frame.png"
                alt="Background"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col items-center mt-52 shadow-lg">
        <h1 className="text-2xl font-bold text-[#0d1361] mb-6">
          Login to your Productr Account
        </h1>

        <p className="text-gray-700 mt-3 text-left min-w-[350px]">
          Enter OTP
        </p>

        <div className="flex gap-3 mb-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)} // ✅ backspace support
              className={`w-12 h-12 text-center border rounded-md text-xl focus:ring-2 outline-none 
                ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#abb0f0]"}`}
            />
          ))}
        </div>

        {/* ✅ Error message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-96 bg-[#0d1361] text-white py-2 rounded-md font-semibold hover:opacity-90 transition"
        >
          Enter your OTP
        </button>

        <p className="text-sm text-gray-400 mt-4">
          Didn’t receive OTP?{" "}
          {counter > 0 ? (
            <span className="text-[#0d1361] font-semibold">Resend in {counter}s</span>
          ) : (
            <button onClick={handleResend} className="text-[#0d1361] font-semibold">
              Resend OTP
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default OtpPage;
