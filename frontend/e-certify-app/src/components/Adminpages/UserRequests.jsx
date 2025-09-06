import { Toaster } from "react-hot-toast";
import { EyeIcon, ClipboardIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function UserRequests({
  requests,
  loading,
  copyRequestToForm,
  setShowConfirm,
  setDeleteId,
  approveRequest,   // ✅ added
}) {
  const [expanded, setExpanded] = useState(null);

  return (
    <>
      <Toaster position="top-right" gutter={8} />
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-4 sm:px-6 md:px-12 py-6">
        <div className="max-w-6xl mx-auto bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-green-400 mb-6 text-center">
            User Requests
          </h2>

          {loading ? (
            <p className="text-gray-400 text-center">Loading requests...</p>
          ) : requests.length === 0 ? (
            <p className="text-gray-400 text-center mt-6 text-sm sm:text-base">
              No user requests found
            </p>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4 sm:p-5 md:p-6 border border-gray-700 rounded-xl bg-gray-900/70 shadow hover:shadow-xl hover:bg-gray-800 transition"
                >
                  {/* Request Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm sm:text-base md:text-lg">
                      {req.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300">
                      ID: {req._id}
                    </p>

                    {expanded === req._id && (
                      <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-200 space-y-1">
                        <p>
                          <span className="font-medium text-white">Course:</span> {req.courseTitle}
                        </p>
                        <p>
                          <span className="font-medium text-white">Type:</span> {req.type}
                        </p>
                        <p>
                          <span className="font-medium text-white">USN:</span> {req.usn}
                        </p>
                        <p>
                          <span className="font-medium text-white">Start:</span> {req.start}
                        </p>
                        <p>
                          <span className="font-medium text-white">End:</span> {req.end}
                        </p>
                        <p>
                          <span className="font-medium text-white">Signatory:</span> {req.signatory}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:gap-3 items-center">
                    <button
                      onClick={() => setExpanded(expanded === req._id ? null : req._id)}
                      className="p-2 sm:p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                      title={expanded === req._id ? "Hide Details" : "View Details"}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => copyRequestToForm(req)}
                      className="p-2 sm:p-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center justify-center"
                      title="Copy Details"
                    >
                      <ClipboardIcon className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => approveRequest(req._id)}   // ✅ approve
                      className="p-2 sm:p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                      title="Approve Request"
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => {
                        setDeleteId(req._id);
                        setShowConfirm(true);
                      }}
                      className="p-2 sm:p-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                      title="Delete Request"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
