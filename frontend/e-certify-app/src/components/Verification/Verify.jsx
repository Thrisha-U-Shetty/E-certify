import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Verify() {
  const { certId } = useParams();   // certId comes from route /verify/:certId
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/certificates/verify/${certId}`);
        const data = await res.json();

        if (data.success) {
          setCert(data.certificate);
        } else {
          setError(data.message || "Certificate not found");
        }
      } catch (err) {
        setError(err+"Server error while verifying");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certId]);

  if (loading) return <p className="p-6">🔍 Verifying certificate...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Certificate Verification</h2>
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <p><b>ID:</b> {cert.certId}</p>
        <p><b>Name:</b> {cert.name}</p>
        <p><b>USN:</b> {cert.usn}</p>
        <p><b>Course:</b> {cert.courseTitle}</p>
        <p><b>Type:</b> {cert.type}</p>
        <p><b>Start:</b> {cert.start}</p>
        <p><b>End:</b> {cert.end}</p>
        <p><b>Issued:</b> {cert.issuedDate}</p>
        <p><b>Signatory:</b> {cert.signatory}</p>
        <p className="text-green-600 font-semibold mt-4">✅ Certificate Verified</p>
      </div>
    </div>
  );
}
