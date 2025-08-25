import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

export default function CreateCertificatePage({ formData, setFormData }) {
  const [qrValue, setQrValue] = useState("");
  const [hash, setHash] = useState("");
  const certificateRef = useRef(null);

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
        const frontendBaseURL = import.meta.env.VITE_FRONTEND_BASE_URL;
        const fullUrl = `${frontendBaseURL}/verify/${data.certId}`;
        setQrValue(fullUrl);
        alert(`Certificate created! Certificate ID: ${data.certId}`);
      } else {
        alert(data.message || "Failed to create certificate");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // --- UPDATED: high-resolution PDF download ---
  const handleDownloadPDF = async () => {
  if (!certificateRef.current) return alert("Certificate preview not found");

  try {
const certWidth = certificateRef.current.offsetWidth;
    const certHeight = certificateRef.current.offsetHeight;

    // Convert certificate to PNG with high resolution
    const dataUrl = await htmlToImage.toPng(certificateRef.current, {
      backgroundColor: "#ffffff",
      pixelRatio: 3,
      width: certificateRef.current.offsetWidth,
      height: certHeight,
      style: { transform: "scale(1)", transformOrigin: "top left", overflow: "hidden" },
    });

    // Create PDF with device width and certificate height
    const pdf = new jsPDF({
      orientation: certWidth > certHeight ? "landscape" : "portrait",
      unit: "px",
      format: [certWidth, certHeight],
    });

    pdf.addImage(dataUrl, "PNG", 0, 0, certWidth, certHeight);
    pdf.save(`${formData.name || "certificate"}.pdf`);
  } catch (err) {
    console.error("PDF generation/download error:", err);
    alert("Failed to generate PDF");
  }
};


  const signatories = {
    cultural: {
      name: "Mr Abhilash Kumar",
      designation: "Cultural Coordinator",
      signature: "./abhilash.png",
    },
    technical: {
      name: "Mr Raviraj Kamath",
      designation: "Technical Coordinator",
      signature: "/raviraj.png",
    },
    hod: {
      name: "Dr Hemalatha P",
      designation: "HOD",
      signature: "/hemalatha.png",
    },
    principal: {
      name: "Dr Johnson",
      designation: "Principal",
      signature: "/johnson.png",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 rounded-2xl shadow-lg">
      {/* --- Left side: Form --- */}
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
            placeholder="Recipient Name"
            maxLength={50}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            name="usn"
            value={formData.usn}
            onChange={handleChange}
            placeholder="USN"
            maxLength={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleChange}
            placeholder="Course Title"
            maxLength={70}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select Type</option>
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
              className="w-1/4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Generate QR
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="w-1/4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Download PDF
            </button>
            <button
              type="button"
              onClick={() => alert("Blockchain function not implemented yet")}
              className="w-1/4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add to Blockchain
            </button>
          </div>
        </form>
      </div>

      {/* --- Right side: Certificate Preview --- */}
      <div
        ref={certificateRef}
        className="certificate-preview text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]"
      >
        <div
          className="bg-white/80 backdrop-blur-lg shadow-md rounded-xl 
                     p-4 sm:p-5 md:p-6 
                     border border-indigo-200 w-full flex flex-col justify-between overflow-hidden"
          style={{ fontFamily: "Times New Roman, Times, serif" }}
        >
          <div className="w-11/12 mx-auto flex flex-col justify-between h-full">
            {/* Logo */}
            <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
              <img
                src="../AJIET.png"
                alt="AJIET"
                className=" h-auto"
              />
            </div>

            {/* Certificate Text */}
            <div className="text-center px-2 sm:px-4">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">
                CERTIFICATE OF ACHIEVEMENT
              </h3>
              <p className="text-[9px] sm:text-[11px] md:text-[13px] lg:text-[15px] text-gray-700 leading-snug">
                This certificate is awarded to{" "}
                <span className="font-semibold">
                  {formData.name || "Recipient Name"}
                </span>{" "}
                bearing USN{" "}
                <span className="font-semibold">
                  {formData.usn || "Roll No"}
                </span>{" "}
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
                <p className="mt-2 sm:mt-3 md:mt-4 text-gray-600 text-[9px] sm:text-[11px] md:text-[12px]">
                  Issued on: {formData.issuedDate}
                </p>
              )}
            </div>

            {/* QR + Signature */}
            <div className="mt-4 sm:mt-5 md:mt-6 flex justify-between items-end px-2 sm:px-4">
              {/* QR */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-1">
                  {qrValue ? (
                    <QRCodeSVG value={qrValue} className="w-full h-full" />
                  ) : (
                    <div className="w-full h-full border-2 border-dashed border-indigo-400 flex items-center justify-center text-gray-500 text-center text-[8px] sm:text-[10px]">
                      QR Placeholder
                    </div>
                  )}
                </div>
                <p className="text-[7px] sm:text-[9px] md:text-[10px] font-medium text-gray-700 mt-1">
                  Scan to Verify Certificate
                </p>
              </div>

              {/* Signature */}
              {formData.signatory && signatories[formData.signatory] && (
                <div className="text-right">
                  <img
                    src={signatories[formData.signatory].signature}
                    alt="Signature"
                    className="w-20 sm:w-24 md:w-28 lg:w-32 h-8 sm:h-9 md:h-10 mx-auto mb-1 object-contain"
                  />
                  <p className="font-medium text-gray-800 text-[9px] sm:text-[11px] md:text-[12px] text-center">
                    {signatories[formData.signatory].name}
                  </p>
                  <p className="text-gray-600 text-[7px] sm:text-[9px] md:text-[10px] text-center">
                    {signatories[formData.signatory].designation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
