// src/App.jsx
import { Routes, Route, Link } from "react-router-dom";
import UploadCertificate from "./Components/UploadCertificate";

function Home() {
  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: "1rem" }}>
      <h1>E-Certify</h1>
      <p>Welcome! Use the link below to upload a certificate.</p>
      <Link to="/upload">Go to Upload</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<UploadCertificate />} />
    </Routes>
  );
}
