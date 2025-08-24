import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./components/Register";
import LandingPage from "./components/LandingPage";
import AdminDashboard from "./components//Adminpages/Admindashboard";
import CreateCertificatePage from "./components/Adminpages/CreateCertificatePage";
import Verify from "./components/Verification/Verify";

function App() {
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
