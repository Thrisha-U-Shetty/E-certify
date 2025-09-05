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
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify/:certId" element={<Verify />} />
      {/* Admin Pages */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/create" element={<CreateCertificatePage />} />

      {/* User Dashboard (with nested routes) */}
      <Route
        path="/dashboard"
        element={<UserDashboard username={username} onLogout={handleLogout} />}
      >
        {/* Default child: redirect to view-certificates */}
        <Route index element={<Navigate to="view-certificates" replace />} />

        {/* Child pages inside dashboard */}
        <Route
          path="view-certificates"
          element={<ViewCertificates username={username} onLogout={handleLogout} />}
        />
        <Route
          path="sendrequest"
          element={<SendRequest username={username} onLogout={handleLogout} />}
        />
      </Route>
    </Routes>
  );
}

export default App;