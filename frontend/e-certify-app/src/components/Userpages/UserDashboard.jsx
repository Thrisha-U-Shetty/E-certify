import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // works in some versions


export default function UserDashboard({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState("User");

  // ✅ Decode JWT token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.name) setUsername(decoded.name);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-black via-gray-900 to-black text-gray-200">
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 transform bg-gray-900/90 backdrop-blur-lg border-r border-green-500/40 shadow-xl flex flex-col justify-between transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-green-500/40">
            <h2 className="text-xl font-bold text-green-400 truncate">
              Welcome, {username}
            </h2>
            <button
              className="md:hidden text-gray-400 hover:text-green-400"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 mt-4 px-4">
            <NavLink
              to="userview"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "hover:bg-gray-800 text-gray-300"
                } truncate`
              }
              onClick={() => setSidebarOpen(false)}
            >
              View Certificates
            </NavLink>
            <NavLink
              to="sendrequest"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "hover:bg-gray-800 text-gray-300"
                } truncate`
              }
              onClick={() => setSidebarOpen(false)}
            >
              My Request
            </NavLink>
          </nav>
        </div>

        {/* Logout at bottom */}
        <div className="p-4 border-t border-green-500/40 mt-auto">
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-900/90 border-b border-green-500/40 shadow">
        <h1 className="text-lg font-semibold text-green-400 truncate">
          Welcome, {username}
        </h1>
        <button
          className="text-gray-400 hover:text-green-400"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 mt-12 md:mt-0 h-[calc(100vh-3rem)] md:h-screen overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}
