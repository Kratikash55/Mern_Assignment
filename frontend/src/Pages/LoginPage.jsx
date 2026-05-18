import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const handleLogin = async () => {

    try {
     const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/signup`,
  {
    email: input.includes("@") ? input : "",
  phone: !input.includes("@") ? input : "",
  }
);

   if (res.data.message === "OTP sent to email" || res.data.message === "OTP sent to phone") {
  navigate("/otp", { state: { email: input.includes("@") ? input : "", phone: !input.includes("@") ? input : "" } });
  setInput("");
}
else {
        alert("Login failed: " + res.data.message);
      }
    } catch (err) {
      console.error(err.response?.data?.message || "Error logging in");
    }
  };
  
// const handleLogin = async () => {

//   console.log("Button clicked");

//   try {

//     const res = await axios.post(
//       "https://mern-assignment-3-ykxd.onrender.com/api/user/signup",
//       {
//         email: input.includes("@") ? input : "",
//         phone: !input.includes("@") ? input : "",
//       }
//     );

//     console.log("API RESPONSE:", res.data);

//     if (
//       res.data.message === "OTP sent to email" ||
//       res.data.message === "OTP sent to phone"
//     ) {

//       navigate("/otp");

//     } else {

//       alert(res.data.message);
//     }

//   } catch (err) {

//     console.log("FULL ERROR:", err);

//     alert("Login Failed");
//   }
// };

  return (
    <div className="flex min-h-screen bg-[#f4f4f4]">
      
      {/* Left Section */}
      <div className="ml-8 mt-8 rounded-[32px] overflow-hidden">
        <div
          className="h-full rounded-sm bg-cover bg-center  relative"
        >

          {/* Card Image */}
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
      <div className="relative w-[718px] h-[1024px] bg-[#f5f5f5] flex items-start justify-center">
        
        {/* Login Box */}
        <div>
          <h1 className="text-3xl font-semibold text-[#0d1361] mb-12 mt-52">
            Login to your Productr Account
          </h1>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email or Phone number
            </label>

            <input
              type="text"
              placeholder="Enter email or phone number"
              onChange={(e) => setInput(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button 
            className="w-full bg-[#0d1361] text-white py-3 rounded-md font-semibold hover:opacity-90 transition"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>

        {/* Signup Box */}
        <div
  className="absolute bottom-10 mb-10 w-[50%] border border-solid border-gray-300 rounded-md py-5 text-center bg-white"
  style={{
    backgroundImage: "radial-gradient(rgba(209,213,219,0.4) 1px, transparent 1px)",
    backgroundSize: "12px 12px"
  }}
>
  <p className="text-sm text-gray-400">
    Don't have a Productr Account
  </p>
  <a href="#" className="text-[#0d1361] font-semibold text-sm">
    SignUp Here
  </a>
</div>

      </div>
    </div>
  );
};

export default LoginPage;