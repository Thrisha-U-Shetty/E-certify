import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "react-hot-toast";
import CreateCertificatePage from "./CreateCertificatePage";
import AllCertificates from "./AllCertificates";
import UserRequests from "./UserRequests";
import { NavLink, Outlet } from "react-router-dom";

export default function AdminDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("requests");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ✅ new state for approve modal
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [approveId, setApproveId] = useState(null);
  const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendBaseUrl}/api/requests/all`);
        const data = await res.json();
        if (res.ok && data.success) {
          setRequests(data.requests);
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // --- Custom toast ---
  const showToast = (message, type = "success") => {
    toast.custom((t) => (
      <div
        className={`w-full sm:w-auto max-w-sm transform transition-all duration-200
        ${
          t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        <div
          className={`${
            type === "success"
              ? "bg-gradient-to-r from-green-700/90 via-green-600/90 to-green-500/90"
              : "bg-gradient-to-r from-red-600 via-red-500 to-red-600"
          } text-white px-4 py-3 rounded-lg shadow-md flex items-center justify-between relative overflow-hidden`}
        >
          {type === "success" && (
            <svg
              className="w-5 h-5 text-white mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}

          <span className="font-medium flex-1">{message}</span>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-2 text-white/80 hover:text-white font-bold text-base"
          >
            ✕
          </button>

          <div
            className="absolute bottom-0 left-0 h-0.5 bg-white/80 rounded-b"
            style={{
              width: "100%",
              animation: "shrink 5s linear forwards",
            }}
          ></div>

          <style>{`
            @keyframes shrink {
              from { transform: scaleX(1); transform-origin: left; }
              to { transform: scaleX(0); transform-origin: left; }
            }
          `}</style>
        </div>
      </div>
    ));
  };

  // --- Copy request to form ---
  const copyRequestToForm = (request) => {
    setFormData({
      name: request.name,
      usn: request.usn,
      courseTitle: request.courseTitle,
      type: request.type,
      start: request.start,
      end: request.end,
      issuedDate: "",
      signatory: request.signatory,
    });
    setActivePage("create");
    showToast("Request copied to certificate form!", "success");
  };

  // --- Approve request ---
  const approveRequest = async (id) => {
    try {
      const res = await fetch(
        `${backendBaseUrl}/api/requests/${id}/approve`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setRequests((prev) => prev.filter((r) => r._id !== id));
        showToast(data.message || "Request approved successfully!", "success");
      } else {
        showToast(data.message || "Failed to approve request!", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error approving request!", "error");
    } finally {
      setApproveId(null);
      setShowApproveConfirm(false);
    }
  };

  // --- Confirm delete ---
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(
        `${backendBaseUrl}/api/requests/${deleteId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setRequests((prev) => prev.filter((r) => r._id !== deleteId));
        setDeleteId(null);
        setShowConfirm(false);
        showToast(data.message || "Request deleted successfully!", "success");
      } else {
        showToast(data.message || "Failed to delete request!", "error");
      }
    } catch (err) {
      console.error(err);
      setShowConfirm(false);
      setDeleteId(null);
      showToast("Error deleting request!", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-black via-gray-900 to-green-900 relative">
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-20 w-64 bg-gray-900/90 backdrop-blur-lg shadow-lg md:translate-x-0 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:flex md:flex-col`}
      >
        <div className="flex items-center justify-between md:justify-center h-16 border-b border-gray-700 px-4">
          <h1 className="text-xl font-bold text-green-400">Admin Dashboard</h1>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => setActivePage("requests")}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
              activePage === "requests"
                ? "bg-green-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            User Requests
          </button>
          <button
            onClick={() => setActivePage("create")}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
              activePage === "create"
                ? "bg-green-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            Create Certificate
          </button>
          <button
            onClick={() => setActivePage("all")}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
              activePage === "all"
                ? "bg-green-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            All Certificates
          </button>
           <button
            onClick={onLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Toggle button for mobile */}
      <button
        className="absolute top-4 left-4 md:hidden text-gray-300 hover:text-white z-30"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={28} />
      </button>

      {/* Main Content */}
      <div className="flex-1 mt-12 md:mt-0 h-[100vh] overflow-auto relative">
        {activePage === "requests" && (
          <UserRequests
            requests={requests}
            loading={loading}
            copyRequestToForm={copyRequestToForm}
            setShowConfirm={setShowConfirm}
            setDeleteId={setDeleteId}
            // ✅ open approve confirmation modal
            approveRequest={(id) => {
              setApproveId(id);
              setShowApproveConfirm(true);
            }}
          />
        )}
        {activePage === "create" && (
          <CreateCertificatePage
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {activePage === "all" && <AllCertificates />}
      </div>

      {/* --- Global Delete Confirmation Modal --- */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-white mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this request?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Global Approve Confirmation Modal --- */}
      {showApproveConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-white mb-4">
              Confirm Approve
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to approve this request?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowApproveConfirm(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => approveRequest(approveId)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
