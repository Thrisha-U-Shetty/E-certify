import React from "react";

export default function AllCertificates() {
  const certificates = [
    {
      id: 1,
      name: "Alice Johnson",
      courseTitle: "React",
      type: "Bootcamp",
    },
    {
      id: 2,
      name: "Bob Smith",
      courseTitle: "Python",
      type: "Workshop",
    },
  ];

  const handleDownload = (cert) => {
    // TODO: Hook with backend to download PDF
    alert(`Downloading PDF for ${cert.name}'s ${cert.courseTitle} ${cert.type} Certificate`);
  };

  const handleView = (cert) => {
    // TODO: Open modal/fullscreen view of certificate
    alert(`Viewing ${cert.name}'s ${cert.courseTitle} ${cert.type} Certificate`);
  };

  return (
    <div className="p-6 bg-white/70 backdrop-blur-lg rounded-xl shadow">
      <h2 className="text-xl font-bold text-indigo-700 mb-6">
        All Certificates
      </h2>
      <div className="space-y-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="flex justify-between items-center p-4 border border-indigo-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
          >
            {/* Left - Certificate Info */}
            <div>
              <p className="text-lg font-semibold text-gray-800">{cert.name}</p>
              <p className="text-sm text-gray-600">
                {cert.courseTitle} {cert.type} Certificate
              </p>
            </div>

            {/* Right - Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handleView(cert)}
                className="px-4 py-2 text-sm bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
              >
                View
              </button>
              <button
                onClick={() => handleDownload(cert)}
                className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
