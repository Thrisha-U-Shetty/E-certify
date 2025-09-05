import React, { useState } from "react";
import { Button } from "../ui/button";

export default function SendRequest() {
  const [formData, setFormData] = useState({
    name: "",
    usn: "",
    courseTitle: "",
    type: "",
    start: "",
    end: "",
    signatory: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  // ✅ Helper: show toast
  const triggerToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 4000);
  };

  // ✅ Handle input change with character restrictions
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      // Allow only alphabets + spaces
      const clean = value.replace(/[^A-Za-z ]/g, "");
      setFormData((prev) => ({ ...prev, [name]: clean }));
      return;
    }

    if (name === "usn") {
      // Allow only alphanumeric, no whitespace/special chars
      const clean = value.replace(/[^A-Za-z0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: clean }));
      return;
    }

    // Default handler
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Validate on submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate name (letters + spaces only, no leading/trailing/multiple spaces)
    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(formData.name)) {
      triggerToast(
        "error",
        "Name must contain only letters and single spaces (no leading/trailing/multiple spaces, numbers, or special characters)."
      );
      return;
    }

    // Validate USN (must have both letters & numbers, no specials)
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(formData.usn)) {
      triggerToast(
        "error",
        "USN must include both letters and numbers (no spaces or special characters)."
      );
      return;
    }

    // Validate start < end date
    if (
      formData.start &&
      formData.end &&
      new Date(formData.start) > new Date(formData.end)
    ) {
      triggerToast(
        "error",
        "Please ensure the start date is before the end date."
      );
      return;
    }

    setShowConfirm(true);
  };

  // 🔑 Confirm submit and send request to backend
  const confirmSubmit = async () => {
    setShowConfirm(false);
    setIsSending(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/requests/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to send request");

      const data = await response.json();
      console.log("Saved Request:", data);

      // Reset form
      setFormData({
        name: "",
        usn: "",
        courseTitle: "",
        type: "",
        start: "",
        end: "",
        signatory: "",
      });

      triggerToast("success", "Request submitted successfully!");
    } catch (err) {
      console.error("Error submitting request:", err);
      triggerToast("error", "Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const signatories = {
    cultural: { designation: "Cultural Coordinator" },
    technical: { designation: "Technical Coordinator" },
    hod: { designation: "HOD" },
    principal: { designation: "Principal" },
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      {/* Form Wrapper */}
      <div className="w-full max-w-lg bg-gray-800/80 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-y-auto border border-green-500">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-green-400 text-center">
          Certificate Request Form
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Recipient Name (Only alphabets)"
            maxLength={50}
            className="w-full border p-3 rounded-lg border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 transition text-sm sm:text-base"
            required
          />

          <input
            type="text"
            name="usn"
            value={formData.usn}
            onChange={handleChange}
            placeholder="USN (letters + numbers, max 10)"
            maxLength={10}
            className="w-full border p-3 rounded-lg border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 transition text-sm sm:text-base"
            required
          />

          <input
            type="text"
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleChange}
            placeholder="Course / Event Title (Max 70)"
            maxLength={70}
            className="w-full border p-3 rounded-lg border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 transition text-sm sm:text-base"
            required
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg border-gray-600 bg-gray-900 text-white focus:ring-2 focus:ring-green-400 transition text-sm sm:text-base"
            required
          >
            <option value="">Select Type of Certification</option>
            <option value="Workshop">Workshop</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Technical Event">Technical Event</option>
            <option value="Cultural Event">Cultural Event</option>
          </select>

          <input
            type={formData.start ? "date" : "text"}
            name="start"
            value={formData.start}
            onChange={handleChange}
            placeholder="Start Date"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!formData.start) e.target.type = "text";
            }}
            className="w-full border p-3 rounded-lg border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 transition text-sm sm:text-base [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200 [&::-webkit-calendar-picker-indicator]:contrast-150"
            required
          />

          <input
            type={formData.end ? "date" : "text"}
            name="end"
            value={formData.end}
            onChange={handleChange}
            placeholder="End Date"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!formData.end) e.target.type = "text";
            }}
            className="w-full border p-3 rounded-lg border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 transition text-sm sm:text-base [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200 [&::-webkit-calendar-picker-indicator]:contrast-150"
            required
          />

          <select
            name="signatory"
            value={formData.signatory}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg border-gray-600 bg-gray-900 text-white focus:ring-2 focus:ring-green-400 transition text-sm sm:text-base"
            required
          >
            <option value="">Select Signatory</option>
            {Object.keys(signatories).map((key) => (
              <option key={key} value={key}>
                {signatories[key].designation}
              </option>
            ))}
          </select>

          <div className="flex justify-center sm:justify-end mt-2">
            <Button
              type="submit"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm sm:text-base"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-xl max-w-sm w-full shadow-lg border border-green-500">
            <h3 className="text-lg font-semibold mb-4 text-center text-white">
              Are you sure the information you entered is correct?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg border border-gray-500 text-white hover:bg-gray-700"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                onClick={confirmSubmit}
              >
                Yes, Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div
          className="fixed z-50 px-4 top-6 inset-x-0 flex justify-center 
            sm:inset-x-auto sm:right-6 sm:justify-end"
        >
          <div
            className={`${
              toast.type === "success" ? "bg-green-600/90" : "bg-red-600/90"
            } text-white px-4 py-3 rounded-lg shadow-md flex items-center justify-between
            w-full sm:w-auto max-w-sm text-sm sm:text-base animate-toastIn relative`}
          >
            <div className="flex items-center gap-2 flex-1">
              {toast.type === "success" && (
                <svg
                  className="w-5 h-5 text-white flex-shrink-0"
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
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => setToast({ show: false, type: "", message: "" })}
              className="ml-3 text-white/80 hover:text-white font-bold text-base"
            >
              ✕
            </button>
            <div className="absolute bottom-0 left-0 h-0.5 bg-white/50 rounded-b animate-progress w-full"></div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes toastIn {
            0% { opacity: 0; transform: translateY(-20px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
          }
          .animate-toastIn { animation: toastIn 0.35s ease-out forwards; }
          .animate-progress { animation: progress 4s linear forwards; }
        `}
      </style>
    </div>
  );
}
