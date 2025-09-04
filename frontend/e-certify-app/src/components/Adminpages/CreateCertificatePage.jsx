import { useState, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import { ethers } from "ethers";
import CertificateRegistryABI from "../contracts/CertificateRegistryABI.json";
import { uploadCertificateToIPFS } from "../utils/ipfs.js";
import { toast } from "react-hot-toast";

export default function CreateCertificatePage({ formData, setFormData }) {
  const [qrValue, setQrValue] = useState("");
  const certificateRef = useRef(null);
  const [certId, setCertId] = useState(null);

  // --- Custom toast functions with close button ---
 const showToast = (message, type = "success") => {
  toast.custom(
    (t) => (
      <div
        className={`w-full sm:w-auto max-w-sm transform transition-all duration-200
          ${t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
      >
        <div
          className={`${
            type === "success"
              ? "bg-green-600/90"
              : "bg-gradient-to-r from-red-600 via-red-500 to-red-600"
          } text-white px-4 py-3 rounded-lg shadow-md flex items-center justify-between relative overflow-hidden`}
        >
          {/* Message only */}
          <span className="font-medium flex-1">{message}</span>

          {/* Close button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-2 text-white/80 hover:text-white font-bold text-base"
          >
            ✕
          </button>

          {/* Progress bar (inline animation, always white) */}
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-white/80 rounded-b"
            style={{
              width: "100%",
              animation: "shrink 5s linear forwards",
            }}
          ></div>

          {/* Keyframes (inline, injected dynamically) */}
          <style jsx>{`
            @keyframes shrink {
              from {
                transform: scaleX(1);
                transform-origin: left;
              }
              to {
                transform: scaleX(0);
                transform-origin: left;
              }
            }
          `}</style>
        </div>
      </div>
    )
  );
};

  const handleUploadAndPush = async () => {
    try {
      if (!certificateRef.current)
        showToast("Certificate preview not found", "error");
      if (!certId) showToast("Please generate certificate first", "error");

      const ipfsUrl = await uploadCertificateToIPFS(certificateRef, certId);
      showToast("Uploaded to IPFS", "success");

      const response = await fetch(
        `http://localhost:5000/api/certificates/${certId}`
      );
      if (!response.ok)
        showToast("Failed to fetch certificate from DB", "error");

      const data = await response.json();
      if (!data.success)
        showToast(data.message || "Certificate not found", "error");

      const certificate = data.cert;

      if (!window.ethereum) showToast("MetaMask not detected", "error");

      const rpcProvider = new ethers.JsonRpcProvider(
        import.meta.env.VITE_TENDERLY_RPC
      );
      const actualChainId = await rpcProvider.send("eth_chainId", []);

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: actualChainId,
            chainName: "Tenderly Fork",
            rpcUrls: [import.meta.env.VITE_TENDERLY_RPC],
            nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
          },
        ],
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      const contract = new ethers.Contract(
        contractAddress,
        CertificateRegistryABI,
        signer
      );

      const requiredFields = [
        "certId",
        "name",
        "usn",
        "courseTitle",
        "type",
        "start",
        "end",
        "issuedDate",
        "signatory",
      ];
      for (const field of requiredFields) {
        if (!certificate[field])
          showToast(`Missing required field: ${field}`, "error");
      }
      if (!ipfsUrl) showToast("Missing IPFS URL", "error");

      const loadingToastId = toast.loading("Transaction sending...");
      const tx = await contract.storeCertificate(
        String(certificate.certId),
        String(certificate.name),
        String(certificate.usn),
        String(certificate.courseTitle),
        String(certificate.type),
        new Date(certificate.start).toISOString(),
        new Date(certificate.end).toISOString(),
        new Date(certificate.issuedDate).toISOString(),
        String(certificate.signatory),
        String(ipfsUrl)
      );
      await tx.wait();
      toast.dismiss(loadingToastId);
    } catch (err) {
      toast.dismiss();
      showToast(err.message, "error");
    }
  };

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
        setCertId(data.certId);
        const frontendBaseURL = import.meta.env.VITE_FRONTEND_BASE_URL;
        const fullUrl = `${frontendBaseURL}/verify/${data.certId}`;
        setQrValue(fullUrl);
        showToast("Certificate created!", "success");
      } else {
        showToast(data.message || "Failed to create certificate", "error");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // // --- UPDATED: high-resolution PDF download ---
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
  //     await new Promise((resolve) => (img.onload = resolve));

  //     const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
  //     const imgWidth = img.width * ratio;
  //     const imgHeight = img.height * ratio;

  //     const x = (pdfWidth - imgWidth) / 2; // center horizontally
  //     const y = (pdfHeight - imgHeight) / 2; // center vertically

  //     pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight);

  //     pdf.save(`${formData.name || "certificate"}.pdf`);
  //   } catch (err) {
  //     console.error("PDF generation/download error:", err);
  //     alert("Failed to generate PDF");
  //   }
  // };

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
    <>
      <Toaster position="bottom-right" gutter={8} />
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* --- Left side: Form --- */}
          <div className="bg-gray-900/70 backdrop-blur-lg p-6 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-extrabold text-green-400 mb-4">
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
                className="w-full px-4 py-2 bg-gray-800 text-white border border-green-500/40 rounded-lg focus:ring-2 focus:ring-green-400"
              />
              <input
                type="text"
                name="usn"
                value={formData.usn}
                onChange={handleChange}
                placeholder="USN"
                maxLength={10}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-green-500/40 rounded-lg focus:ring-2 focus:ring-green-400"
              />
              <input
                type="text"
                name="courseTitle"
                value={formData.courseTitle}
                onChange={handleChange}
                placeholder="Course Title"
                maxLength={70}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-green-500/40 rounded-lg focus:ring-2 focus:ring-green-400"
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-green-500/40 rounded-lg focus:ring-2 focus:ring-green-400"
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
                className="w-full px-4 py-2 bg-gray-800 text-white border border-green-500/40 rounded-lg focus:ring-2 focus:ring-green-400"
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
                className="w-full px-4 py-2 bg-gray-800 text-white border border-green-500/40 rounded-lg focus:ring-2 focus:ring-green-400"
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
                className="w-full px-4 py-2 bg-gray-800 text-white border border-green-500/40 rounded-lg focus:ring-2 focus:ring-green-400"
              />
              <select
                name="signatory"
                value={formData.signatory}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-green-500/40 rounded-lg focus:ring-2 focus:ring-green-400"
              >
                <option value="">Select Signatory</option>
                <option value="cultural">Cultural Coordinator</option>
                <option value="technical">Technical Coordinator</option>
                <option value="hod">HOD</option>
                <option value="principal">Principal</option>
              </select>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleGenerateQR}
                  className="w-full sm:w-1/2 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                >
                  Generate QR
                </button>
                <button
                  type="button"
                  onClick={handleUploadAndPush}
                  className="w-full sm:w-1/2 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
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
              className="bg-white shadow-lg rounded-xl p-4 border border-gray-300"
              style={{ fontFamily: "Times New Roman, Times, serif" }}
            >
              <div className="w-11/12 mx-auto flex flex-col justify-between h-full">
                <div className="flex justify-center items-center">
                  <img src="../AJIET.png" alt="AJIET" className="mb-5" />
                </div>

                <div className="text-center px-3 italic">
                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-800 mb-2">
                    CERTIFICATE OF ACHIEVEMENT
                  </h3>
                  <p className="text-gray-700 leading-snug">
                    This certificate is awarded to{" "}
                    <span className="font-semibold text-black">
                      {formData.name || "Recipient Name"}
                    </span>{" "}
                    bearing USN{" "}
                    <span className="font-semibold text-black">
                      {formData.usn || "Roll No"}
                    </span>{" "}
                    {formData.type === "Workshop" ? (
                      <>
                        for successfully completing{" "}
                        <span className="font-semibold text-black">
                          {formData.courseTitle || "Course Title"}
                        </span>{" "}
                        <span className="font-medium">{formData.type}</span>
                      </>
                    ) : (
                      <>
                        for participating in{" "}
                        <span className="font-semibold text-black">
                          {formData.courseTitle || "Event Title"}
                        </span>{" "}
                        <span className="font-medium">{formData.type}</span>
                      </>
                    )}{" "}
                    from {formData.start || "Start Date"} to{" "}
                    {formData.end || "End Date"}.
                  </p>
                  {formData.issuedDate && (
                    <p className="mt-2 text-gray-600 text-sm">
                      Issued on: {formData.issuedDate}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex justify-between items-end px-3">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 mb-1">
                      {qrValue ? (
                        <QRCodeSVG value={qrValue} className="w-full h-full" />
                      ) : (
                        <div className="w-full h-full border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-500 text-xs">
                          QR
                        </div>
                      )}
                    </div>
                    <p className="text-[9px] text-gray-600 italic">
                      Scan QR to verify certificate
                    </p>
                    {certId && (
                      <p className="mt-1 text-[9px] text-gray-600 italic">
                        Certificate ID:{" "}
                        <span className="font-bold text-black">{certId}</span>
                      </p>
                    )}
                  </div>

                  {formData.signatory && signatories[formData.signatory] && (
                    <div className="text-right italic">
                      <img
                        src={signatories[formData.signatory].signature}
                        alt="Signature"
                        className="w-24 h-9 mx-auto mb-1 object-contain"
                      />
                      <p className="font-medium text-black text-sm text-center">
                        {signatories[formData.signatory].name}
                      </p>
                      <p className="text-gray-600 text-xs text-center">
                        {signatories[formData.signatory].designation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

