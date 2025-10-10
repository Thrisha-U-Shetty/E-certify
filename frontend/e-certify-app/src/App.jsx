import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/LoadingSpinner";
import { useAuthStore } from "./store/authStore";

// Auth pages
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
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
  const { isCheckingAuth, checkAuth, user } = useAuthStore(); // user object includes role
  const username = user?.name || "User";
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => setShowLogoutConfirm(true);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = {
    role: localStorage.getItem("userRole"),
    name: localStorage.getItem("userName"),
  };
  if (!token || !user.role) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  if (!token || !userRole) return <Navigate to="/login" replace />;
  if (userRole !== "admin") return <Navigate to="/user" replace />;
  return children;
};

const UserRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  if (!token || !userRole) return <Navigate to="/login" replace />;
  if (userRole !== "user") return <Navigate to="/admin" replace />;
  return children;
};


  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden">
      <Routes>
        {/* Public Pages (no role restriction) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify/:certId" element={<Verify />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Admin Pages */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard username={username} onLogout={handleLogout} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/create"
          element={
            <AdminRoute>
              <CreateCertificatePage />
            </AdminRoute>
          }
        />

        {/* User Pages */}
        <Route
          path="/user"
          element={
            <UserRoute>
              <UserDashboard username={username} onLogout={handleLogout} />
            </UserRoute>
          }
        >
          <Route index element={<Navigate to="userview" replace />} />
          <Route
            path="userview"
            element={
              <ViewCertificates username={username} onLogout={handleLogout} />
            }
          />
          <Route
            path="sendrequest"
            element={
              <SendRequest username={username} onLogout={handleLogout} />
            }
          />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-white mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" gutter={8} reverseOrder={false} />
    </div>
  );
}

export default App;
