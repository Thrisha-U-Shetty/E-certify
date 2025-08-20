// src/components/UploadCertificate.jsx
import { useState } from "react";
import API from "../Services/api";
import CryptoJS from "crypto-js"; 

export default function UploadCertificate() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");

  const handleFileChange = (e) => {
    const chosen = e.target.files?.[0];
    setFile(chosen ?? null);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name.trim()) {
    alert("Please enter a certificate name");
    return;
  }
  if (!file) {
    alert("Please select a file");
    return;
  }

  const reader = new FileReader();

  reader.onloadend = async () => {
    try {
      const wordArray = CryptoJS.lib.WordArray.create(reader.result);
      const hash = CryptoJS.SHA256(wordArray).toString();

      // Send name + hash to backend
      const res = await API.post("/certificates/upload", {
        name: name.trim(),
        hash,
      });

      alert("Uploaded successfully: " + (res.data?.name ?? name));
      setName("");
      setFile(null);
      e.target.reset?.();
    } catch (err) {
      console.error("Upload failed:", err);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Upload failed. Please try again.";
      alert(msg);
    }
  };

  reader.readAsArrayBuffer(file);
};

  return (
    <div style={{ maxWidth: 520, margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Upload Certificate</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Certificate Name
          </label>
          <input
            type="text"
            placeholder="e.g., Data Structures – May 2025"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Certificate File
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            required
            // (optional) restrict to types your backend accepts
            // accept=".pdf,.png,.jpg,.jpeg"
          />
        </div>

        <button type="submit" style={{ padding: "0.6rem 1rem" }}>
          Upload
        </button>
      </form>
    </div>
  );
}
