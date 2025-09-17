import React, { useEffect, useState } from "react";
import { EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function AllCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch(`${backendBaseUrl}/api/certificates/all`);
        const data = await res.json();
        if (data.success) {
          setCertificates(data.certificates);
          setFilteredCertificates(data.certificates);
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

  // Filter whenever search term changes
  useEffect(() => {
    const results = certificates.filter(
      (cert) =>
        cert.certId.toString().includes(searchTerm) ||
        cert.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCertificates(results);
  }, [searchTerm, certificates]);

  if (loading) return <p className="text-gray-400 text-center mt-6 text-sm sm:text-base">Loading certificates...</p>;
  if (error) return <p className="text-gray-400 text-center mt-15 text-sm sm:text-base">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-extrabold text-green-400 mb-6 text-center">
          All Certificates
        </h2>

        {/* 🔍 Search Bar with Icon Inside */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-full sm:w-2/3">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Certificate Id"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-green-500/40 focus:ring-2 focus:ring-green-400 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map((cert) => (
              <div
                key={cert.certId}
                className="flex justify-between items-center p-4 border border-green-500/40 rounded-xl shadow-md bg-gray-800/70 hover:shadow-lg hover:border-green-400 transition"
              >
                <div>
                  <p className="text-lg font-semibold text-white">
                    ID: {cert.certId}
                  </p>
                  <p className="text-sm text-gray-300">
                    Event Name: {cert.courseTitle}
                  </p>
                  <p className="text-sm text-gray-300">
                    Recipient: {cert.name}
                  </p>
                </div>

                <button
                  onClick={() => window.open(cert.ipfsUrl, "_blank")}
                  className="p-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition flex items-center justify-center"
                  title="View Certificate"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No certificates found</p>
          )}
        </div>
      </div>
    </div>
  );
}
