import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

export async function uploadCertificateToIPFS(certificateRef, certId) {
  if (!certificateRef?.current) throw new Error("Certificate preview not found");
  if (!certId) throw new Error("Certificate ID is required");

  // --- Convert certificate DOM to PNG ---
  const dataUrl = await htmlToImage.toJpeg(certificateRef.current, {
    quality: 0.9,
    backgroundColor: "#ffffff",
    pixelRatio: 1.5,  // REDUCED → fixes 9MB PDF
  });

  // --- Generate PDF from JPEG ---
  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [612, 792] });

  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve) => (img.onload = resolve));

  const ratio = Math.min(612 / img.width, 792 / img.height);
  const imgWidth = img.width * ratio;
  const imgHeight = img.height * ratio;
  const x = (612 - imgWidth) / 2;
  const y = (792 - imgHeight) / 2;

  pdf.addImage(img, "JPEG", x, y, imgWidth, imgHeight, undefined, "FAST");

  // --- Convert PDF to Base64 ---
  const pdfBase64 = pdf.output("datauristring").split(",")[1];

  // --- Send JSON to backend ---
  const response = await fetch("http://localhost:5000/api/certificates/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ certificateId: certId, pdfBase64 }),
  });

  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

  const result = await response.json();
  if (!result.success) throw new Error(result.message || "Upload failed");

  return result.ipfsUrl;
}
