import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

export async function uploadCertificateToIPFS(certificateRef, certId) {
  if (!certificateRef?.current) throw new Error("Certificate preview not found");
  if (!certId) throw new Error("Certificate ID is required");

  // --- Convert certificate DOM to PNG ---
  const dataUrl = await htmlToImage.toPng(certificateRef.current, {
    backgroundColor: "#ffffff",
    pixelRatio: 3,
  });

  // --- Generate PDF from PNG ---
  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [612, 792] });
  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve) => (img.onload = resolve));

  const ratio = Math.min(612 / img.width, 792 / img.height);
  const imgWidth = img.width * ratio;
  const imgHeight = img.height * ratio;
  const x = (612 - imgWidth) / 2;
  const y = (792 - imgHeight) / 2;

  pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight);

  // --- Convert PDF to Base64 ---
  const pdfBase64 = pdf.output("datauristring").split(",")[1]; // remove prefix

  // --- Send JSON to backend ---
  const response = await fetch("http://localhost:5000/api/certificates/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      certificateId: certId,
      pdfBase64, // base64 string
    }),
  });

  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

  const result = await response.json();
  if (!result.success) throw new Error(result.message || "Upload failed");

  return result.ipfsUrl; // Return IPFS URL
}
