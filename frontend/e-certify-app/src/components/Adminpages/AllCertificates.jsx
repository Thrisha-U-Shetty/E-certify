import React, { useState } from "react";
import { EyeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";

export default function AllCertificates() {
  const [selectedCert, setSelectedCert] = useState(null);

  const certificates = [
    {
      id: 1,
      name: "Alice Johnson",
      courseTitle: "React",
      type: "Bootcamp",
      fileUrl: "/certificates/react.pdf",
    },
    {
      id: 2,
      name: "Bob Smith",
      courseTitle: "Python",
      type: "Workshop",
      fileUrl: "/certificates/python.pdf",
    },
  ];

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

    // --- UPDATED: high-resolution PDF download ---
  // const handleDownloadPDF = async () => {
  //   if (!certificateRef.current) return alert("Certificate preview not found");
  
  //   try {
  //     // Fixed PDF size: Letter (8.5 x 11 inches) at 72 DPI
  //     const pdfWidth = 612;
  //     const pdfHeight = 792;
  
  //     // Convert certificate DOM to PNG
  //     const dataUrl = await htmlToImage.toPng(certificateRef.current, {
  //       backgroundColor: "#ffffff",
  //       pixelRatio: 3,
  //       style: {
  //         transform: "scale(1)",
  //         transformOrigin: "top left",
  //         overflow: "hidden",
  //       },
  //     });
  
  //     // Create PDF (Letter size, portrait orientation)
  //     const pdf = new jsPDF({
  //       orientation: "portrait", // change to "landscape" if you prefer
  //       unit: "px",
  //       format: [pdfWidth, pdfHeight],
  //     });
  
  //     // Scale the image proportionally to fit inside Letter page
  //     const img = new Image();
  //     img.src = dataUrl;
  //     await new Promise(resolve => (img.onload = resolve));
  
  //     const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
  //     const imgWidth = img.width * ratio;
  //     const imgHeight = img.height * ratio;
  
  //     const x = (pdfWidth - imgWidth) / 2;  // center horizontally
  //     const y = (pdfHeight - imgHeight) / 2; // center vertically
  
  //     pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight);
  
  //     pdf.save(`${formData.name || "certificate"}.pdf`);
  //   } catch (err) {
  //     console.error("PDF generation/download error:", err);
  //     alert("Failed to generate PDF");
  //   }
  // };

  return (
    <div className="p-6 bg-white/70 backdrop-blur-lg rounded-xl shadow min-h-screen">
      <h2 className="text-xl font-bold text-indigo-700 mb-6">
        All Certificates
      </h2>

      <div className="space-y-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="flex flex-col p-4 border border-indigo-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
          >
            {/* Certificate Info */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {cert.name}
                </p>
                <p className="text-sm text-gray-600">
                  {cert.courseTitle} {cert.type} Certificate
                </p>
              </div>

              {/* Action - Eye Icon */}
              <button
                onClick={() =>
                  setSelectedCert(selectedCert?.id === cert.id ? null : cert)
                }
                className="p-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition flex items-center justify-center"
                title="View Certificate"
              >
                <EyeIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Inline Certificate Preview */}
            {selectedCert?.id === cert.id && (
              <div className="mt-4">
                <h3 className="text-md font-bold text-indigo-700 mb-2">
                  {cert.name} - {cert.courseTitle} {cert.type}
                </h3>
                <iframe
                  src={cert.fileUrl}
                  title="Certificate Preview"
                  className="w-full h-[300px] border rounded"
                ></iframe>
                <div className="mt-3 flex justify-center">
                  <button
                    onClick={() => handleDownload(cert.fileUrl)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition flex items-center gap-2"
                    title="Download Certificate"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
