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
    issuedBy: "E-Certify Institute",
    signatory: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    setShowConfirm(false);
    setIsSending(true);

    setTimeout(() => {
      const submittedData = { ...formData };
      setIsSending(false);

      // Clear form
      setFormData({
        name: "",
        usn: "",
        courseTitle: "",
        type: "",
        start: "",
        end: "",
        issuedBy: "E-Certify Institute",
        signatory: "",
      });

      console.log("Request Data:", submittedData);

      // ✅ Show animated toast
      setToast("Request sent to admin!");

      // Auto hide toast after 3s
      setTimeout(() => setToast(null), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-lg w-full mx-4 sm:mx-auto mt-6 bg-white rounded-2xl shadow p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-indigo-700 text-center sm:text-left">
        Certificate Request Form
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Recipient Name (Max 50)"
          maxLength={50}
          className="w-full border p-3 rounded-lg border-indigo-300 bg-white/60 focus:ring-2 focus:ring-indigo-400 transition text-sm sm:text-base"
          required
        />

        <input
          type="text"
          name="usn"
          value={formData.usn}
          onChange={handleChange}
          placeholder="USN (Max 10)"
          maxLength={10}
          className="w-full border p-3 rounded-lg border-indigo-300 bg-white/60 focus:ring-2 focus:ring-indigo-400 transition text-sm sm:text-base"
          required
        />

        <input
          type="text"
          name="courseTitle"
          value={formData.courseTitle}
          onChange={handleChange}
          placeholder="Course / Event Title (Max 70)"
          maxLength={70}
          className="w-full border p-3 rounded-lg border-indigo-300 bg-white/60 focus:ring-2 focus:ring-indigo-400 transition text-sm sm:text-base"
          required
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg border-indigo-300 bg-white/60 focus:ring-2 focus:ring-indigo-400 transition text-sm sm:text-base"
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
          className="w-full border p-3 rounded-lg border-indigo-300 bg-white/60 focus:ring-2 focus:ring-indigo-400 transition text-sm sm:text-base"
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
          className="w-full border p-3 rounded-lg border-indigo-300 bg-white/60 focus:ring-2 focus:ring-indigo-400 transition text-sm sm:text-base"
          required
        />

        <select
          name="signatory"
          value={formData.signatory}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg border-indigo-300 bg-white/60 focus:ring-2 focus:ring-indigo-400 transition text-sm sm:text-base"
          required
        >
          <option value="">Select Signatory</option>
          <option value="Dr. A. Kumar">Dr. A. Kumar</option>
          <option value="Prof. B. Sharma">Prof. B. Sharma</option>
          <option value="Mrs. C. Reddy">Mrs. C. Reddy</option>
        </select>

        <div className="flex justify-center sm:justify-end mt-2">
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 sm:px-6 py-2 rounded-lg flex items-center text-sm sm:text-base"
            disabled={isSending}
          >
            {isSending && (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 sm:w-5 sm:h-5 mr-2"></span>
            )}
            Send Request
          </Button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Are you sure the information you entered is correct?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={confirmSubmit}
              >
                Yes, Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce z-50 text-sm sm:text-base">
          {toast}
        </div>
      )}
    </div>
  );
}
