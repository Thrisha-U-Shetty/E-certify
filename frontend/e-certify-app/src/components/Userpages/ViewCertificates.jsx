import React, { useState } from "react";
import { EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function ViewCertificates({ username }) {
  const certificates = [
    {
      certId: "529741",
      eventTitle: "React Basics",
      fileUrl:
        "https://gateway.pinata.cloud/ipfs/QmevrDbFN4Qn5CkQGgiPhXcriruGfRHdrByyFHsUWtQs46",
    },
    {
      certId: "836205",
      eventTitle: "NodeJS Advanced",
      fileUrl:
        "https://gateway.pinata.cloud/ipfs/QmevrDbFN4Qn5CkQGgiPhXcriruGfRHdrByyFHsUWtQs46",
    },
    {
      certId: "194638",
      eventTitle: "Python Data Science",
      fileUrl:
        "https://gateway.pinata.cloud/ipfs/QmevrDbFN4Qn5CkQGgiPhXcriruGfRHdrByyFHsUWtQs46",
    },
    {
      certId: "705492",
      eventTitle: "Web Security Fundamentals",
      fileUrl:
        "https://gateway.pinata.cloud/ipfs/QmevrDbFN4Qn5CkQGgiPhXcriruGfRHdrByyFHsUWtQs46",
    },
    {
      certId: "463817",
      eventTitle: "Cloud Architecture",
      fileUrl:
        "https://gateway.pinata.cloud/ipfs/QmevrDbFN4Qn5CkQGgiPhXcriruGfRHdrByyFHsUWtQs46",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const handleView = (cert) => {
    window.open(cert.fileUrl, "_blank");
  };

  // Search by certificate ID instead of title
  const filteredCertificates = certificates.filter((cert) =>
    cert.certId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-500">
      <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-6">
        {username ? `${username}'s Certificates` : "Certificates"}
      </h2>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by Certificate ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-4">
        {filteredCertificates.map((cert) => (
          <div
            key={cert.certId}
            className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-4 border border-gray-700 rounded-xl shadow bg-gray-800/70 hover:border-green-500 hover:shadow-lg transition"
          >
            {/* Left - Certificate Info */}
            <div>
              <p className="text-lg font-bold text-green-300">
                Certificate ID: {cert.certId}
              </p>
              <p className="text-md text-gray-300 mt-1">
                Event Title: {cert.eventTitle}
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
        
        {filteredCertificates.length === 0 && (
          <p className="text-center text-gray-400 py-4">
            No certificates found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}




