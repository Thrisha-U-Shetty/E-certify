import React, { useState } from "react";
import { EyeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";

export default function AllCertificates() {
  const [selectedCert, setSelectedCert] = useState(null);

  const certificates = [
    {
      id: 1,
      name: "Alice Johnson",
      courseTitle: "React",
      type: "Bootcamp",
      fileUrl: "/certificates/react.pdf",
    },
    {
      id: 2,
      name: "Bob Smith",
      courseTitle: "Python",
      type: "Workshop",
      fileUrl: "/certificates/python.pdf",
    },
  ];

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-white/70 backdrop-blur-lg rounded-xl shadow min-h-screen flex flex-col md:flex-row gap-6">
      {/* Left - Certificates List */}
      <div className="w-full md:w-1/2">
        <h2 className="text-xl font-bold text-indigo-700 mb-6">
          All Certificates
        </h2>
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex justify-between items-center p-4 border border-indigo-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
            >
              {/* Certificate Info */}
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {cert.name}
                </p>
                <p className="text-sm text-gray-600">
                  {cert.courseTitle} {cert.type} Certificate
                </p>
              </div>

              {/* Action - Eye Icon */}
              <button
                onClick={() => setSelectedCert(cert)}
                className="p-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition flex items-center justify-center"
                title="View Certificate"
              >
                <EyeIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Certificate Preview */}
      <div className="w-full md:w-1/2 bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
        {selectedCert ? (
          <>
            <h3 className="text-lg font-bold text-indigo-700 mb-4">
              {selectedCert.name} - {selectedCert.courseTitle} {selectedCert.type}
            </h3>
            <iframe
              src={selectedCert.fileUrl}
              title="Certificate Preview"
              className="w-full h-[25vh] md:h-[500px] border rounded"
            ></iframe>
            <button
              onClick={() => handleDownload(selectedCert.fileUrl)}
              className="mt-4 p-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition flex items-center justify-center"
              title="Download Certificate"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </button>
          </>
        ) : (
          <p className="text-gray-600">Select a certificate to preview</p>
        )}
      </div>
    </div>
  );
}
