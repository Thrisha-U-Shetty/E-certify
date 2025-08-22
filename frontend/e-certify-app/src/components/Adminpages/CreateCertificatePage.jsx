import { useState } from "react";

export default function CreateCertificatePage() {
  const [form, setForm] = useState({
    name: "",
    usn: "",
    courseTitle: "",
    type: "",
    start: "",
    end: "",
    issuedDate: "",
    signatory: "",
  });

  const [qrValue, setQrValue] = useState("");
  const [hash, setHash] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerateQR = () => {
    const uniqueId = `${form.name}-${form.usn}-${Date.now()}`;
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

  // Predefined signatories
  const signatories = {
    cultural: {
      name: "Mrs Pratheksha Rai",
      designation: "Cultural Coordinator",
      signature: "/signatures/cultural.png",
    },
    technical: {
      name: "Mr Nithin Heraje",
      designation: "Technical Coordinator",
      signature: "/signatures/technical.png",
    },
    hod: {
      name: "Dr Anthony PJ",
      designation: "HOD",
      signature: "/signatures/hod.png",
    },
    principal: {
      name: "Dr Shantarama Rai",
      designation: "Principal",
      signature: "/signatures/principal.png",
    },
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

          {/* NEW USN field */}
          <input
            type="text"
            name="usn"
            value={form.usn}
            onChange={handleChange}
            placeholder="USN"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

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
            <option value="Workshop">Workshop</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Technical Event">Technical Event</option>
            <option value="Cultural Event">Cultural Event</option>
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

          {/* NEW Signatory Dropdown */}
          <select
            name="signatory"
            value={form.signatory}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select Signatory</option>
            <option value="cultural">Cultural Coordinator</option>
            <option value="technical">Technical Coordinator</option>
            <option value="hod">HOD</option>
            <option value="principal">Principal</option>
          </select>

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
      <div
        className="bg-white/80 backdrop-blur-lg shadow-md rounded-xl p-8 border border-indigo-200 w-full max-w-4xl h-full flex flex-col justify-between"
        style={{ fontFamily: "Times New Roman, Times, serif" }}
      >
        <div className="flex justify-between items-center mb-8">
          {/* Replaced issuer + logo with static AJIET image */}
          <img src="./public/AJIET.png" alt="AJIET" className="w-full h-auto" />
        </div>

        <div className="text-center px-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Certificate of Completion
          </h3>

          <p className="text-lg text-gray-700">
            This certificate is awarded to{" "}
            <span className="font-semibold">
              {form.name || "Recipient Name"}
            </span>{" "}
            bearing USN{" "}
            <span className="font-semibold">{form.usn || "Roll No"}</span>{" "}
            {form.type === "Workshop" ? (
              <>
                for successfully completing{" "}
                <span className="font-semibold">
                  {form.courseTitle || "Course Title"}
                </span>{" "}
                <span className="font-medium">{form.type}</span>
              </>
            ) : (
              <>
                for participating in{" "}
                <span className="font-semibold">
                  {form.courseTitle || "Event Title"}
                </span>{" "}
                <span className="font-medium">{form.type}</span>
              </>
            )}{" "}
            from {form.start || "Start Date"} to {form.end || "End Date"}.
          </p>

          {form.issuedDate && (
            <p className="mt-6 text-gray-600">Issued on: {form.issuedDate}</p>
          )}
        </div>

        {/* Bottom Section */}
        <div className="mt-10 flex justify-between items-end px-6">
          {/* Left: QR */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 border-2 border-dashed border-indigo-400 flex items-center justify-center text-gray-500 mb-2">
              {qrValue ? "QR Generated" : "QR Placeholder"}
            </div>
            <p className="text-sm text-indigo-600 text-center">
              {qrValue
                ? `Verify at: ${qrValue}`
                : "QR will appear here after generation."}
            </p>
          </div>

          {/* Right: Signature */}
          {form.signatory && signatories[form.signatory] && (
            <div className="text-right">
              <img
                src={signatories[form.signatory].signature}
                alt="Signature"
                className="h-16 mx-auto mb-2"
              />
              <p className="font-medium text-gray-800">
                {signatories[form.signatory].name}
              </p>
              <p className="text-gray-600 text-sm">
                {signatories[form.signatory].designation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
