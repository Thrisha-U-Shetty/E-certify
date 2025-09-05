import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import CreateCertificatePage from "./CreateCertificatePage";
import AllCertificates from "./AllCertificates";
import UserRequests from "./UserRequests";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("requests");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form state lifted here
  const [formData, setFormData] = useState({
    name: "",
    usn: "",
    courseTitle: "",
    type: "",
    start: "",
    end: "",
    issuedDate: "",
    signatory: "",
  });

  // Function to copy request to form and auto redirect
  const copyRequestToForm = (request) => {
    setFormData({
      name: request.name,
      usn: request.usn,
      courseTitle: request.courseTitle,
      type: request.type,
      start: request.start,
      end: request.end,
      issuedDate: "",
      signatory: "",
    });
    setActivePage("create");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-black via-gray-900 to-green-900">
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 transform bg-black/90 backdrop-blur-lg shadow-xl flex flex-col justify-between transition-transform duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div>
          <div className="flex items-center justify-between px-6 py-4 border-b border-green-500">
            <h2 className="text-xl font-bold text-green-400">Admin Panel</h2>
            <button
              className="md:hidden text-green-400 hover:text-green-300"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-2 mt-4 px-4">
            <button
              onClick={() => {
                setActivePage("requests");
                setSidebarOpen(false);
              }}
              className={`px-4 py-2 text-left rounded-lg transition ${
                activePage === "requests"
                  ? "bg-green-600 text-white"
                  : "hover:bg-green-800 text-green-400"
              }`}
            >
              Requests
            </button>
            <button
              onClick={() => {
                setActivePage("create");
                setSidebarOpen(false);
              }}
              className={`px-4 py-2 text-left rounded-lg transition ${
                activePage === "create"
                  ? "bg-green-600 text-white"
                  : "hover:bg-green-800 text-green-400"
              }`}
            >
              Create Certificate
            </button>
            <button
              onClick={() => {
                setActivePage("all");
                setSidebarOpen(false);
              }}
              className={`px-4 py-2 text-left rounded-lg transition ${
                activePage === "all"
                  ? "bg-green-600 text-white"
                  : "hover:bg-green-800 text-green-400"
              }`}
            >
              All Certificates
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-green-500">
          <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition">
            Logout
          </button>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-black/90 shadow">
        <h1 className="text-lg font-semibold text-green-400">Admin Panel</h1>
        <button
          className="text-green-400 hover:text-green-300"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 mt-12 md:mt-0 h-[100vh] overflow-auto">
        {activePage === "requests" && (
          <UserRequests copyRequestToForm={copyRequestToForm} />
        )}
        {activePage === "create" && (
          <CreateCertificatePage formData={formData} setFormData={setFormData} />
        )}
        {activePage === "all" && <AllCertificates />}
      </div>
    </div>
  );
}
