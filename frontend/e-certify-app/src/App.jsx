import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/LoadingSpinner";
import { useAuthStore } from "./store/authStore";

// Auth pages
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// User/Admin pages
import Verify from "./components/Verification/Verify";
import SendRequest from "./components/Userpages/SendRequest";
import UserDashboard from "./components/Userpages/UserDashboard";
import ViewCertificates from "./components/Userpages/ViewCertificates";
import LandingPage from "./components/LandingPage";
import AdminDashboard from "./components/Adminpages/Admindashboard";
import CreateCertificatePage from "./components/Adminpages/CreateCertificatePage";

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const username = "User";
  const navigate = useNavigate();
  

  
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div
      className="w-screen h-screen bg-gradient-to-br
  from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden"
    >

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify/:certId" element={<Verify />} />

        {/* Auth Pages */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Dashboard Pages */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Admin Pages */}
        <Route path="/admin" element={<AdminDashboard username="admin"  onLogout={handleLogout} /> }/>
        <Route path="/admin/create" element={<CreateCertificatePage />} />

        {/* User Dashboard (with nested routes) */}
        <Route
          path="/user"
          element={<UserDashboard username={username} onLogout={handleLogout} />}
        >
          <Route index element={<Navigate to="userview" replace />} />
          <Route
            path="userview"
            element={<ViewCertificates username={username} onLogout={handleLogout} />}
          />
          <Route
            path="sendrequest"
            element={<SendRequest username={username} onLogout={handleLogout} />}
          />
        </Route>

        {/* Catch all routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-right" gutter={8} reverseOrder={false} />
    </div>
  );
}

export default App;
