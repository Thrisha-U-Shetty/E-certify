import React, { useState } from "react";
import CreateCertificatePage from "./CreateCertificatePage";
import AllCertificates from "./AllCertificates";
import UserRequests from "./UserRequests";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("requests");

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
      {/* Sidebar */}
      <div className="w-64 bg-white/80 backdrop-blur-lg shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-indigo-700">Admin Panel</h2>
          </div>
          <nav className="flex flex-col gap-2 mt-4 px-4">
            <button
              onClick={() => setActivePage("requests")}
              className={`px-4 py-2 text-left rounded-lg transition ${
                activePage === "requests"
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-indigo-100 text-gray-700"
              }`}
            >
              Requests
            </button>
            <button
              onClick={() => setActivePage("create")}
              className={`px-4 py-2 text-left rounded-lg transition ${
                activePage === "create"
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-indigo-100 text-gray-700"
              }`}
            >
              Create Certificate
            </button>
            <button
              onClick={() => setActivePage("all")}
              className={`px-4 py-2 text-left rounded-lg transition ${
                activePage === "all"
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-indigo-100 text-gray-700"
              }`}
            >
              All Certificates
            </button>
          </nav>
        </div>

        {/* Bottom - Logout only */}
        <div className="p-4 border-t">
          <button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activePage === "requests" && <UserRequests />}
        {activePage === "create" && <CreateCertificatePage />}
        {activePage === "all" && <AllCertificates />}
      </div>
    </div>
  );
}
