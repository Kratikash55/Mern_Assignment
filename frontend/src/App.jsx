import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import OtpPage from "./Pages/otpPage";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Product";

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
