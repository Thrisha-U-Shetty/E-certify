import { useState } from "react";

export default function CreateCertificatePage() {
  const [form, setForm] = useState({
    name: "",
    courseTitle: "", // NEW field
    type: "",
    start: "",
    end: "",
    issuedBy: "E-Certify Institute",
    issuedDate: "",
    logo: null,
  });

  const [qrValue, setQrValue] = useState("");
  const [hash, setHash] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateQR = () => {
    const uniqueId = `${form.name}-${Date.now()}`;
    setHash(uniqueId);
    setQrValue(uniqueId);
  };

  const handleAddToBlockchain = async () => {
    if (!hash) {
      alert("Generate QR (hash) first before pushing to blockchain.");
      return;
    }

    try {
      console.log("Pushing to blockchain:", hash);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Certificate hash successfully added to blockchain!");
    } catch (error) {
      console.error("Blockchain push failed:", error);
      alert("Failed to push to blockchain. Check console.");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-6 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 rounded-2xl shadow-lg">
      {/* Left Side - Form */}
      <div className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          Create Certificate
        </h2>
        <form className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Recipient Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          {/* NEW field before type */}
          <input
            type="text"
            name="courseTitle"
            value={form.courseTitle}
            onChange={handleChange}
            placeholder="Course Title (e.g., React, AI, Blockchain)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select Type of Certification</option>
            <option value="Bootcamp">Bootcamp</option>
            <option value="Workshop">Workshop</option>
            <option value="Internship">Internship</option>
          </select>

          {/* Dates with placeholder trick */}
          <input
            type={form.start ? "date" : "text"}
            name="start"
            value={form.start}
            onChange={handleChange}
            placeholder="Start Date"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!form.start) e.target.type = "text";
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type={form.end ? "date" : "text"}
            name="end"
            value={form.end}
            onChange={handleChange}
            placeholder="End Date"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!form.end) e.target.type = "text";
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type={form.issuedDate ? "date" : "text"}
            name="issuedDate"
            value={form.issuedDate}
            onChange={handleChange}
            placeholder="Issued Date"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!form.issuedDate) e.target.type = "text";
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="text"
            name="issuedBy"
            value={form.issuedBy}
            onChange={handleChange}
            placeholder="Issued By"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          {/* Upload Company Logo */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Upload Company Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Two buttons */}
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

      {/* Right Side - Certificate Preview */}
      <div className="bg-white/80 backdrop-blur-lg shadow-md rounded-xl p-8 border border-indigo-200">
        <div className="flex justify-between items-center mb-8">
          {form.logo ? (
            <img src={form.logo} alt="Logo" className="h-16 w-auto rounded" />
          ) : (
            <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded border">
              Logo
            </div>
          )}
          <h2 className="text-2xl font-extrabold text-indigo-700">
            {form.issuedBy || "Institute Name"}
          </h2>
        </div>

        <div className="text-center px-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Certificate of Completion
          </h3>

          <p className="text-lg text-gray-700">
            This certificate is awarded to{" "}
            <span className="font-semibold">{form.name || "Recipient Name"}</span>{" "}
            for successfully completing the{" "}
            <span className="font-semibold">
              {form.courseTitle || "Course Title"} {form.type || "Course"}
            </span>{" "}
            from {form.start || "Start Date"} to {form.end || "End Date"}, issued
            by <span className="font-semibold">{form.issuedBy}</span>.
          </p>

          {form.issuedDate && (
            <p className="mt-6 text-gray-600">Issued on: {form.issuedDate}</p>
          )}
        </div>

        {/* QR Display */}
        <div className="mt-10 flex flex-col items-center">
          <div className="w-32 h-32 border-2 border-dashed border-indigo-400 flex items-center justify-center text-gray-500 mb-4">
            {qrValue ? "QR Generated" : "QR Placeholder"}
          </div>
          <p className="text-sm text-indigo-600 text-center">
            {qrValue
              ? `Verify this certificate at: ${qrValue}`
              : "QR will appear here after generation."}
          </p>
        </div>
      </div>
    </div>
  );
}
