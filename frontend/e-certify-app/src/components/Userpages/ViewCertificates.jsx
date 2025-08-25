import React, { useState } from "react";
import { Button } from "../ui/button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

export default function ViewCertificates({ username }) {
  const [selectedCert, setSelectedCert] = useState(null);

  const certificates = [
    { id: 1, title: "React Basics", fileUrl: "/certificates/react.pdf" },
    { id: 2, title: "NodeJS Advanced", fileUrl: "/certificates/node.pdf" },
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
    <div className="min-h-screen bg-indigo-50 p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
      {/* Certificate List */}
      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow p-4">
        <h2 className="font-bold text-lg mb-4 text-indigo-700">Certificates</h2>
        <ul>
          {certificates.map((cert) => (
            <li
              key={cert.id}
              className={`cursor-pointer p-2 rounded hover:bg-indigo-100 transition ${
                selectedCert?.id === cert.id ? "bg-indigo-200 font-semibold" : ""
              }`}
              onClick={() => setSelectedCert(cert)}
            >
              {cert.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Certificate Preview */}
      <div className="w-full md:w-2/3 bg-white rounded-2xl shadow p-4 flex flex-col relative">
        {selectedCert ? (
          <>
            <h2 className="font-bold mb-4 text-indigo-700 text-lg md:text-xl">
              {selectedCert.title}
            </h2>
            <div className="flex-1 relative">
              {/* PDF Preview */}
              <iframe
                src={selectedCert.fileUrl}
                title="Certificate Preview"
                className="w-full h-[400px] md:h-[500px] border rounded"
              ></iframe>

              {/* Download button fixed at bottom-right corner */}
              <div className="absolute bottom-4 right-4">
                <Button
                  className="flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 p-2 rounded-full"
                  onClick={() => handleDownload(selectedCert.fileUrl)}
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-center mt-10">
            Select a certificate to preview
          </p>
        )}
      </div>
    </div>
  );
}
