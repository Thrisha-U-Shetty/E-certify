import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { fetchCertificate } from "../contracts/contract.js";

export default function Verify() {
  const { certId } = useParams();
  const navigate = useNavigate();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    try {
      const certificate = await fetchCertificate(certId);
      setCert(certificate);
      setShowTable(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      {/* Header */}
      <div className="flex justify-center mb-4">
        <h2 className="text-7xl font-extrabold text-green-400 text-center">
          E-Certify
        </h2>
      </div>

      {/* Loading or Error */}
      {loading && <p className="text-xl text-green-300 text-center">🔍 Verifying certificate on blockchain...</p>}
      {error && <p className="text-xl text-red-500 text-center">{error}</p>}

      {/* Show verify button if not showing table yet */}
      {!showTable && !loading && (
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

      {/* Show Table after verification */}
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
                  <td className="border border-gray-700 px-4 py-2">{new Date(cert.start).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2 font-medium">End Date</td>
                  <td className="border border-gray-700 px-4 py-2">{new Date(cert.end).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2 font-medium">Issued</td>
                  <td className="border border-gray-700 px-4 py-2">{new Date(cert.issuedDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2 font-medium">Signatory</td>
                  <td className="border border-gray-700 px-4 py-2">{cert.signatory}</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-2 font-medium">Certificate PDF</td>
                  <td className="border border-gray-700 px-4 py-2">
                    {cert.ipfsUrl && (
                      <a href={cert.ipfsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                        View PDF
                      </a>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xl font-semibold text-green-400 mt-6 text-center">
            🎉 Congratulations! Your certificate is successfully verified on blockchain!
          </p>

          <button
            onClick={() => navigate(0)}
            className="mt-6 px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-md transition"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}