import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "react-hot-toast";
import CreateCertificatePage from "./CreateCertificatePage";
import AllCertificates from "./AllCertificates";
import UserRequests from "./UserRequests";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("requests");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [requests, setRequests] = useState([]); // ✅ Central requests state
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

  // --- Fetch requests ---
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/requests/all");
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

  // --- Custom toast function (with progress + close) ---
const showToast = (message, type = "success") => {
  toast.custom((t) => (
    <div
      className={`w-full sm:w-auto max-w-sm transform transition-all duration-200
        ${t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
    >
      <div
        className={`${
          type === "success"
            ? "bg-gradient-to-r from-green-700/90 via-green-600/90 to-green-500/90"
            : "bg-gradient-to-r from-red-600 via-red-500 to-red-600"
        } text-white px-4 py-3 rounded-lg shadow-md flex items-center justify-between relative overflow-hidden`}
      >
        {/* ✅ Success Icon (only for success type) */}
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

        {/* Message */}
        <span className="font-medium flex-1">{message}</span>

        {/* Close button */}
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-2 text-white/80 hover:text-white font-bold text-base"
        >
          ✕
        </button>

        {/* Progress bar */}
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

  // --- Confirm delete ---
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${deleteId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log("Delete response:", data);

      if (res.ok && data.success) {
        setRequests((prev) => prev.filter((r) => r._id !== deleteId));
        setDeleteId(null);
        setShowConfirm(false);
        console.log("Calling success toast");
        showToast(data.message || "Request deleted successfully!", "success");
      } else {
        console.log("Calling error toast");
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
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 transform bg-black/90 backdrop-blur-lg shadow-xl flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
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
      <div className="flex-1 mt-12 md:mt-0 h-[100vh] overflow-auto relative">
        {activePage === "requests" && (
          <UserRequests
            requests={requests}
            loading={loading}
            copyRequestToForm={copyRequestToForm}
            setShowConfirm={setShowConfirm}
            setDeleteId={setDeleteId}
          />
        )}
        {activePage === "create" && (
          <CreateCertificatePage formData={formData} setFormData={setFormData} />
        )}
        {activePage === "all" && <AllCertificates />}
      </div>

      {/* --- Global Confirmation Modal --- */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
          <div className="bg-gray-800 p-6 rounded-xl max-w-sm w-full shadow-lg border border-red-600">
            <h3 className="text-lg font-semibold mb-4 text-center text-white">
              Are you sure you want to delete this request?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg border border-gray-500 text-white hover:bg-gray-700"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
