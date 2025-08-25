import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function UserDashboard({ username, onLogout }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
      {/* Sidebar */}
      <div className="w-64 bg-white/80 backdrop-blur-lg shadow-xl flex flex-col justify-between">
        <div>
          {/* Welcome */}
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-indigo-700">
              Welcome, {username}
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 mt-4 px-4">
            <NavLink
              to="view-certificates"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-700 hover:bg-indigo-100"
                }`
              }
            >
              View Certificates
            </NavLink>
            <NavLink
              to="sendrequest"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-700 hover:bg-indigo-100"
                }`
              }
            >
              My Request
            </NavLink>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content (Child Routes show here) */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}
