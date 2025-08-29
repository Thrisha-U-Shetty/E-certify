import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { uploadCertificateToIPFS } from "../utils/blockchain";

export default function CreateCertificatePage({ formData, setFormData }) {
  const [qrValue, setQrValue] = useState("");
  const certificateRef = useRef(null);
  const [certId, setCertId] = useState(null);

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
        setCertId(data.certId); // store in state
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
      // Fixed PDF size: Letter (8.5 x 11 inches) at 72 DPI
      const pdfWidth = 612;
      const pdfHeight = 792;

      // Convert certificate DOM to PNG
      const dataUrl = await htmlToImage.toPng(certificateRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 3,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          overflow: "hidden",
        },
      });

      // Create PDF (Letter size, portrait orientation)
      const pdf = new jsPDF({
        orientation: "portrait", // change to "landscape" if you prefer
        unit: "px",
        format: [pdfWidth, pdfHeight],
      });

      // Scale the image proportionally to fit inside Letter page
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
      const imgWidth = img.width * ratio;
      const imgHeight = img.height * ratio;

      const x = (pdfWidth - imgWidth) / 2; // center horizontally
      const y = (pdfHeight - imgHeight) / 2; // center vertically

      pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight);

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 rounded-2xl shadow-lg">
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
              onClick={async () => {
                try {
                  const ipfsUrl = await uploadCertificateToIPFS(
                    certificateRef,
                    certId
                  );
                  alert(`✅ Certificate uploaded!\nIPFS URL: ${ipfsUrl}`);
                } catch (err) {
                  alert(err + " ❌ Upload failed, check console.");
                }
              }}
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
        className="certificate-preview text-[9px] sm:text-[11px] md:text-[13px] lg:text-[15px]"
      >
        <div
          className="bg-white/80 backdrop-blur-lg shadow-md rounded-lg 
               p-3 sm:p-4 md:p-5 
               border border-indigo-200 w-full flex flex-col justify-between overflow-hidden"
          style={{ fontFamily: "Times New Roman, Times, serif" }}
        >
          <div className="w-11/12 mx-auto flex flex-col justify-between h-full">
            {/* Logo */}
            <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-5">
              <img src="../AJIET.png" alt="AJIET" />
            </div>

            {/* Certificate Text */}
            <div className="text-center px-1 sm:px-3">
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 mb-2">
                CERTIFICATE OF ACHIEVEMENT
              </h3>
              <p className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px] text-gray-700 leading-snug">
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
                <p className="mt-1 sm:mt-2 md:mt-3 text-gray-600 text-[8px] sm:text-[10px] md:text-[11px]">
                  Issued on: {formData.issuedDate}
                </p>
              )}
            </div>

            {/* QR + Signature */}
            <div className="mt-3 sm:mt-4 md:mt-5 flex justify-between items-end px-2 sm:px-3">
              {/* QR */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 mb-1">
                  {qrValue ? (
                    <QRCodeSVG value={qrValue} className="w-full h-full" />
                  ) : (
                    <div className="w-full h-full border-2 border-dashed border-indigo-400 flex items-center justify-center text-gray-500 text-[7px] sm:text-[9px]">
                      QR Placeholder
                    </div>
                  )}
                </div>
                <p className="text-[7px] sm:text-[8px] md:text-[9px] font-medium text-gray-700 mt-1">
                  Scan to Verify Certificate
                </p>
              </div>

              {/* Signature */}
              {formData.signatory && signatories[formData.signatory] && (
                <div className="text-right">
                  <img
                    src={signatories[formData.signatory].signature}
                    alt="Signature"
                    className="w-18 sm:w-20 md:w-24 h-7 sm:h-8 md:h-9 mx-auto mb-1 object-contain"
                  />
                  <p className="font-medium text-gray-800 text-[8px] sm:text-[10px] md:text-[11px] text-center">
                    {signatories[formData.signatory].name}
                  </p>
                  <p className="text-gray-600 text-[6px] sm:text-[8px] md:text-[9px] text-center">
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
