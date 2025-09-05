import React, { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/24/solid";

export default function AllCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/certificates/all");
        const data = await res.json();
        if (data.success) {
          setCertificates(data.certificates);
        } else {
          setError(data.message || "Failed to load certificates");
        }
      } catch (err) {
        setError(err.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) return <p className="p-6">Loading certificates...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 bg-white/70 backdrop-blur-lg rounded-xl shadow min-h-screen">
      <h2 className="text-xl font-bold text-indigo-700 mb-6">
        All Certificates
      </h2>

      <div className="space-y-4">
        {certificates.map((cert) => (
          <div
            key={cert.certId}
            className="flex justify-between items-center p-4 border border-indigo-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
          >
            <div>
              <p className="text-lg font-semibold text-gray-800">
                ID: {cert.certId}
              </p>
              <p className="text-sm text-gray-600">
                Event Name: {cert.courseTitle} 
              </p>
              <p className="text-sm text-gray-600">Recipient: {cert.name}</p>
            </div>

            <button
              onClick={() => window.open(cert.ipfsUrl, "_blank")}
              className="p-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition flex items-center justify-center"
              title="View Certificate"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
