import React from "react";
import { EyeIcon } from "@heroicons/react/24/solid";

export default function ViewCertificates({ username }) {
  const certificates = [
    {
      id: 1,
      title: "React Basics",
      fileUrl:
        "https://gateway.pinata.cloud/ipfs/QmevrDbFN4Qn5CkQGgiPhXcriruGfRHdrByyFHsUWtQs46",
    },
    {
      id: 2,
      title: "NodeJS Advanced",
      fileUrl:
        "https://gateway.pinata.cloud/ipfs/QmevrDbFN4Qn5CkQGgiPhXcriruGfRHdrByyFHsUWtQs46",
    },
  ];

  const handleView = (cert) => {
    window.open(cert.fileUrl, "_blank");
  };

  return (
    <div className="p-4 md:p-6 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-500">
      <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-6">
        {username ? `${username}'s Certificates` : "Certificates"}
      </h2>

      <div className="space-y-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-4 border border-gray-700 rounded-xl shadow bg-gray-800/70 hover:border-green-500 hover:shadow-lg transition"
          >
            {/* Left - Certificate Info */}
            <div>
              <p className="text-lg font-semibold text-white">{cert.title}</p>
              <p className="text-sm text-gray-400">
                Certificate ID: {cert.id}
              </p>
            </div>

            {/* Right - Eye Icon only */}
            <button
              onClick={() => handleView(cert)}
              className="flex items-center justify-center p-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition self-start sm:self-auto"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
