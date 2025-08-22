import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./components/Register";
import LandingPage from "./components/LandingPage";
import AdminDashboard from "./components/Admindashboard";
import CreateCertificatePage from "./components/CreateCertificatePage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
         {/* Admin (Dashboard + Subpages) */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create" element={<CreateCertificatePage />} /> 
      </Routes>
  );
}

export default App;
