import { useState, useEffect } from "react";
import { EyeIcon, ClipboardIcon, TrashIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

// ✅ Toast function
const showToast = (message, type = "success") => {
  toast.custom((t) => (
    <div
      className={`w-full sm:w-auto max-w-sm transform transition-all duration-200
        ${t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
    >
      <div
        className={`${
          type === "success"
            ? "bg-green-600/90"
            : "bg-gradient-to-r from-red-600 via-red-500 to-red-600"
        } text-white px-4 py-3 rounded-lg shadow-md flex items-center justify-between relative overflow-hidden`}
      >
        {/* Message only */}
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

        <style jsx>{`
          @keyframes shrink {
            from {
              transform: scaleX(1);
              transform-origin: left;
            }
            to {
              transform: scaleX(0);
              transform-origin: left;
            }
          }
        `}</style>
      </div>
    </div>
  ));
};

export default function UserRequests({ copyRequestToForm }) {
  const [requests, setRequests] = useState([]);
  const [expanded, setExpanded] = useState(null);

  // ✅ Fetch requests
useEffect(() => {
  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/requests");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRequests(data);
      showToast("Requests loaded ", "success");
    } catch {
      showToast("Failed to fetch requests ", "error");
    }
  };
  fetchRequests();
}, []);

// ✅ Delete request
const handleDelete = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/requests/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setRequests((prev) => prev.filter((req) => req.id !== id));
      showToast("Request deleted ", "success");
    } else {
      showToast("Failed to delete ", "error");
    }
  } catch {
    showToast("Server error while deleting ", "error");
  }
};


  const handleCopy = (req) => {
    copyRequestToForm(req);
    showToast("Request copied to form ", "success");
  };

  return (
    <div className="p-6 bg-black/80 backdrop-blur-lg border border-gray-700 rounded-xl shadow-lg">
      <h2 className="text-2xl font-extrabold text-green-400 mb-6 text-center">
        User Requests
      </h2>

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="p-4 border border-gray-700 rounded-lg bg-gray-900/70 shadow hover:shadow-xl hover:bg-gray-800 transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">{req.name}</p>
                <p className="text-sm text-gray-300">ID: {req.id}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setExpanded(expanded === req.id ? null : req.id)
                  }
                  className="p-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition flex items-center justify-centerr"
                  title={expanded === req.id ? "Hide Details" : "View More"}
                >
                  <EyeIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={() => handleCopy(req)}
                  className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center justify-center"
                  title="Copy Details"
                >
                  <ClipboardIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={() => handleDelete(req.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                  title="Delete Request"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {expanded === req.id && (
              <div className="mt-4 text-sm text-gray-200 space-y-1">
                <p>
                  <span className="font-medium text-white">
                    Course / Event Name:
                  </span>{" "}
                  {req.courseTitle}
                </p>
                <p>
                  <span className="font-medium text-white">
                    Certification Type:
                  </span>{" "}
                  {req.type}
                </p>
                <p>
                  <span className="font-medium text-white">USN:</span> {req.usn}
                </p>
                <p>
                  <span className="font-medium text-white">Start Date:</span>{" "}
                  {req.start}
                </p>
                <p>
                  <span className="font-medium text-white">End Date:</span>{" "}
                  {req.end}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
