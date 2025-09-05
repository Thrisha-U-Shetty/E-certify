import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Verify from "./components/Verification/Verify";
import SendRequest from "./components/Userpages/SendRequest";
import UserDashboard from "./components/Userpages/UserDashboard";
import ViewCertificates from "./components/Userpages/ViewCertificates";
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import AdminDashboard from "./components/Adminpages/Admindashboard";
import CreateCertificatePage from "./components/Adminpages/CreateCertificatePage";
function App() {
  const username = "User";

  const handleLogout = () => {
    alert("User logged out!");
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify/:certId" element={<Verify />} />
      {/* Admin (Dashboard + Subpages) */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/create" element={<CreateCertificatePage />} />
    </Routes>
  );
}

export default App;