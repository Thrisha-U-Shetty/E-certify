import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function CreateCertificatePage({ formData, setFormData }) {
  const [qrValue, setQrValue] = useState("");
  const [hash, setHash] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGenerateQR = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/certificates/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (data.success) {
        setHash(data.certId);

        // Use LAN IP or deployed domain
        const frontendBaseURL = import.meta.env.VITE_FRONTEND_BASE_URL; // replace with your PC LAN IP during testing or else frontenfd url 
        const fullUrl = `${frontendBaseURL}/verify/${data.certId}`;

        setQrValue(fullUrl); // QR now points to full URL
        alert(`Certificate created! Certificate ID: ${data.certId}`);
      } else {
        alert(data.message || "Failed to create certificate");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleAddToBlockchain = async () => {
    if (!hash)
      return alert("Generate QR (hash) first before pushing to blockchain.");
    try {
      console.log("Pushing to blockchain:", hash);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Certificate hash successfully added to blockchain!");
    } catch (error) {
      console.error("Blockchain push failed:", error);
      alert("Failed to push to blockchain. Check console.");
    }
  };

  const signatories = {
    cultural: {
      name: "Mrs Pratheksha Rai",
      designation: "Cultural Coordinator",
      signature: "/signatures/cultural.png",
    },
    technical: {
      name: "Mr Nithin Heraje",
      designation: "Technical Coordinator",
      signature: "/signatures/technical.png",
    },
    hod: {
      name: "Dr Anthony PJ",
      designation: "HOD",
      signature: "/signatures/hod.png",
    },
    principal: {
      name: "Dr Shantarama Rai",
      designation: "Principal",
      signature: "/signatures/principal.png",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 rounded-2xl shadow-lg">
      <div className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          Create Certificate
        </h2>
        <form className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Recipient Name (Maxlength:50)"
            maxLength={50}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            name="usn"
            value={formData.usn}
            onChange={handleChange}
            placeholder="USN (Maxlength:10)"
            maxLength={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleChange}
            placeholder="Course Title (Maxlength:70)"
            maxLength={70}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select Type of Certification</option>
            <option value="Workshop">Workshop</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Technical Event">Technical Event</option>
            <option value="Cultural Event">Cultural Event</option>
          </select>
          <input
            type={formData.start ? "date" : "text"}
            name="start"
            value={formData.start}
            onChange={handleChange}
            placeholder="Start Date"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!formData.start) e.target.type = "text";
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type={formData.end ? "date" : "text"}
            name="end"
            value={formData.end}
            onChange={handleChange}
            placeholder="End Date"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!formData.end) e.target.type = "text";
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type={formData.issuedDate ? "date" : "text"}
            name="issuedDate"
            value={formData.issuedDate}
            onChange={handleChange}
            placeholder="Issued Date"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!formData.issuedDate) e.target.type = "text";
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          <select
            name="signatory"
            value={formData.signatory}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select Signatory</option>
            <option value="cultural">Cultural Coordinator</option>
            <option value="technical">Technical Coordinator</option>
            <option value="hod">HOD</option>
            <option value="principal">Principal</option>
          </select>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleGenerateQR}
              className="w-1/2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Generate QR
            </button>
            <button
              type="button"
              onClick={handleAddToBlockchain}
              className="w-1/2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
            >
              Add to Blockchain
            </button>
          </div>
        </form>
      </div>

      <div
        className="bg-white/80 backdrop-blur-lg shadow-md rounded-xl p-6 border border-indigo-200 w-full flex flex-col justify-between h-[20vh] md:h-[90%] overflow-auto"
        style={{ fontFamily: "Times New Roman, Times, serif" }}
      >
        <div className="w-11/12 mx-auto flex flex-col justify-between h-full">
          <div className="flex justify-between items-center mb-6">
            <img src="./AJIET.png" alt="AJIET" className="w-full h-auto" />
          </div>

          <div className="text-center px-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              CERTIFICATE OF ACHIEVEMENT
            </h3>
            <p className="text-sm text-gray-700">
              This certificate is awarded to{" "}
              <span className="font-semibold">
                {formData.name || "Recipient Name"}
              </span>{" "}
              bearing USN{" "}
              <span className="font-semibold">{formData.usn || "Roll No"}</span>{" "}
              {formData.type === "Workshop" ? (
                <>
                  for successfully completing{" "}
                  <span className="font-semibold">
                    {formData.courseTitle || "Course Title"}
                  </span>{" "}
                  <span className="font-medium">{formData.type}</span>
                </>
              ) : (
                <>
                  for participating in{" "}
                  <span className="font-semibold">
                    {formData.courseTitle || "Event Title"}
                  </span>{" "}
                  <span className="font-medium">{formData.type}</span>
                </>
              )}{" "}
              from {formData.start || "Start Date"} to{" "}
              {formData.end || "End Date"}.
            </p>
            {formData.issuedDate && (
              <p className="mt-4 text-gray-600 text-sm">
                Issued on: {formData.issuedDate}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-between items-end px-4">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-1">
                {qrValue ? (
                  <QRCodeSVG value={qrValue} className="w-full h-full" />
                ) : (
                  <div className="w-full h-full border-2 border-dashed border-indigo-400 flex items-center justify-center text-gray-500 text-center">
                    QR Placeholder
                  </div>
                )}
              </div>
              <p className="text-xs font-medium text-gray-700 mt-1">
                Scan to Verify Certificate
              </p>
            </div>

            {formData.signatory && signatories[formData.signatory] && (
              <div className="text-right">
                <img
                  src={signatories[formData.signatory].signature}
                  alt="Signature"
                  className="h-12 mx-auto mb-1"
                />
                <p className="font-medium text-gray-800 text-sm">
                  {signatories[formData.signatory].name}
                </p>
                <p className="text-gray-600 text-xs">
                  {signatories[formData.signatory].designation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
