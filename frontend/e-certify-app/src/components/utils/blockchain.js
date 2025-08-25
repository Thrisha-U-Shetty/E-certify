import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function generateCertificatePDF(certificateRef) {
  try {
    // 1️⃣ Convert certificate DOM node to canvas
    const canvas = await html2canvas(certificateRef);
    const imgData = canvas.toDataURL("image/png");

    // 2️⃣ Create PDF
    const pdf = new jsPDF("landscape", "pt", "a4");
    pdf.addImage(imgData, "PNG", 20, 20, 800, 550);

    // 3️⃣ Return PDF as Blob URL (for preview/download)
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    return pdfUrl; // return the link so frontend can open/download
  } catch (err) {
    console.error("PDF generation error:", err);
    throw err;
  }
}
