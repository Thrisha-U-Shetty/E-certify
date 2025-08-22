import React, { useState } from "react";
import { Button } from "../components/ui/button";
import UserNavbar from "../components/UserNavbar";

export default function ViewCertificates({ username, onLogout }) {
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
    <div className="min-h-screen bg-indigo-50">
      <UserNavbar username={username} onLogout={onLogout} />

      <div className="flex p-6 gap-6">
        {/* Certificate List */}
        <div className="w-1/3 bg-white rounded-2xl shadow p-4">
          <h2 className="font-bold text-lg mb-4 text-indigo-700">Certificates</h2>
          <ul>
            {certificates.map((cert) => (
              <li
                key={cert.id}
                className={`cursor-pointer p-2 rounded hover:bg-indigo-100 ${
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
        <div className="w-2/3 bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center">
          {selectedCert ? (
            <>
              <h2 className="font-bold mb-4 text-indigo-700">{selectedCert.title}</h2>
              <iframe
                src={selectedCert.fileUrl}
                title="Certificate Preview"
                className="w-full h-[500px] border rounded"
              ></iframe>
              <Button
                className="mt-4"
                onClick={() => handleDownload(selectedCert.fileUrl)}
              >
                Download Certificate
              </Button>
            </>
          ) : (
            <p className="text-gray-600">Select a certificate to preview</p>
          )}
        </div>
      </div>
    </div>
  );
}
