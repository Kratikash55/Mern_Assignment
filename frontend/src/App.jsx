import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage.jsx";
import OtpPage from "./Pages/otpPage.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Products from "./Pages/Product.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
       <Route path="/otp" element={<OtpPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
}

export default App;
