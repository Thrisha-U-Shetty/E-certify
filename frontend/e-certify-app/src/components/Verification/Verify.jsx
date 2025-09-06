import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { fetchCertificate } from "../contracts/contract.js";

let toastTimeout = null;
let currentToastId = null; // store currently active toast

const showToast = (message, type = "success", delay = 500) => {
  // clear any pending timeouts
  if (toastTimeout) clearTimeout(toastTimeout);

  return new Promise((resolve) => {
    toastTimeout = setTimeout(() => {
      // dismiss previous toast if any
      if (currentToastId) toast.dismiss(currentToastId);

      const id = toast.custom(
        (t) => (
          <div
            className={`w-full sm:w-auto max-w-sm transform transition-all duration-200
              ${t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
          >
            <div
              className={`relative overflow-hidden px-4 py-3 rounded-lg shadow-md flex items-center justify-between
                ${
                  type === "success"
                    ? "bg-gradient-to-r from-green-700/90 via-green-600/90 to-green-500/90 text-white"
                    : type === "loading"
                    ? "bg-white text-gray-600 border border-gray-300"
                    : "bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white"
                }`}
            >
              {/* ✅ Success Tick Icon */}
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
                className={`ml-3 font-bold text-lg leading-none 
                  ${
                    type === "loading"
                      ? "text-gray-500 hover:text-gray-700"
                      : "text-white/80 hover:text-white"
                  }`}
              >
                ✕
              </button>

              {/* Progress bar (skip for loading) */}
              {type !== "loading" && (
                <div
                  className="absolute bottom-0 left-0 h-0.5 bg-white/80 rounded-b"
                  style={{
                    width: "100%",
                    animation: "shrink 5s linear forwards",
                  }}
                ></div>
              )}

              <style>{`
                @keyframes shrink {
                  from { transform: scaleX(1); transform-origin: left; }
                  to { transform: scaleX(0); transform-origin: left; }
                }
              `}</style>
            </div>
          </div>
        ),
        { duration: type === "loading" ? Infinity : 5000 }
      );

      currentToastId = id; // store this toast id
      resolve(id); // return toast id after showing
    }, delay);
  });
};



export default function Verify() {
  const { certId } = useParams();
  const [cert, setCert] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const handleVerify = async () => {
    const toastId = showToast("🔍 Verifying certificate on blockchain...", "loading");

    try {
      const certificate = await fetchCertificate(certId);
      setCert(certificate);
      setShowTable(true);

      toast.dismiss(toastId);
      showToast(" Certificate verified successfully!", "success");
    } catch (err) {
      toast.dismiss(toastId);
      const message =
        err?.message ?? (typeof err === "string" ? err : "Failed to verify certificate");
      showToast(message, "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      {/* Toast container (stacks downward) */}
      <Toaster position="top-right" gutter={8} reverseOrder={false} />

      {/* Header */}
      <div className="flex justify-center mb-4">
        <h2 className="text-7xl font-extrabold text-green-400 text-center">
          E-Certify
        </h2>
      </div>

      {/* Verify button screen */}
      {!showTable && (
        <div className="flex flex-col justify-center items-center flex-1 space-y-6">
          <p className="text-2xl font-semibold text-green-300 text-center mt-8">
            🔗 Your certificate is stored securely on the Blockchain
          </p>
          <button
            onClick={handleVerify}
            className="flex items-center gap-3 px-6 py-3 rounded-lg text-lg font-semibold 
                       bg-green-500 hover:bg-green-600 text-white 
                       transition-all duration-300 shadow-lg"
          >
            <CheckCircle className="w-6 h-6 text-white" />
            Verify Certificate
          </button>
        </div>
      )}

      {/* Verified table screen */}
      {showTable && cert && (
        <div className="flex flex-col items-center mt-6">
          <div className="overflow-x-auto w-full max-w-3xl">
            <table className="table-auto border-collapse border border-gray-700 w-full shadow-lg rounded-lg">
              <thead>
                <tr className="bg-gray-800">
                  <th
                    colSpan="2"
                    className="border border-gray-700 px-4 py-3 text-center font-semibold text-lg text-green-400"
                  >
                    Certificate Validation Information
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-700 px-4 py-2 font-medium">Certificate ID</td>
                  <td className="border border-gray-700 px-4 py-2">{cert.certId}</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2 font-medium">Student</td>
                  <td className="border border-gray-700 px-4 py-2">{cert.name}</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2 font-medium">USN</td>
                  <td className="border border-gray-700 px-4 py-2">{cert.usn}</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2 font-medium">Course</td>
                  <td className="border border-gray-700 px-4 py-2">{cert.courseTitle}</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2 font-medium">Type</td>
                  <td className="border border-gray-700 px-4 py-2">{cert.certType || cert.type}</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2 font-medium">Start Date</td>
                  <td className="border border-gray-700 px-4 py-2">
                    {new Date(cert.start).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2 font-medium">End Date</td>
                  <td className="border border-gray-700 px-4 py-2">
                    {new Date(cert.end).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2 font-medium">Issued</td>
                  <td className="border border-gray-700 px-4 py-2">
                    {new Date(cert.issuedDate).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2 font-medium">Signatory</td>
                  <td className="border border-gray-700 px-4 py-2">{cert.signatory}</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2 font-medium">Certificate PDF</td>
                  <td className="border border-gray-700 px-4 py-2">
                    {cert.ipfsUrl && (
                      <a
                        href={cert.ipfsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline"
                      >
                        View PDF
                      </a>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Back button resets state */}
          <button
            onClick={() => {
              setCert(null);
              setShowTable(false);
            }}
            className="mt-6 px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-md transition"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}  