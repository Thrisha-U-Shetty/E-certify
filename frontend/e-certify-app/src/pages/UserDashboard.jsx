// src/pages/UserDashboard.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";

export default function UserDashboard({ username, themeColor = "indigo" }) {
  const [activeTab, setActiveTab] = useState("viewCertificates");
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const certificates = [
    { id: 1, title: "React Basics", fileUrl: "/certificates/react.pdf" },
    { id: 2, title: "NodeJS Advanced", fileUrl: "/certificates/node.pdf" },
    { id: 3, title: "Blockchain 101", fileUrl: "/certificates/blockchain.pdf" },
  ];

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md sticky top-0 z-50 rounded-b-2xl border border-indigo-200">
        <h1 className={`text-2xl font-extrabold text-${themeColor}-700 tracking-tight`}>
          Welcome, {username}
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full px-4 py-2 bg-white/70 backdrop-blur-sm border border-indigo-300 hover:bg-white hover:shadow transition">
              {username}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44 bg-white/95 backdrop-blur-sm border border-indigo-200 shadow-xl rounded-xl">
            <DropdownMenuItem onClick={() => alert("Profile clicked")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Logout")}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mt-8 gap-4 flex-wrap">
        {["viewCertificates", "sendRequest"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              activeTab === tab
                ? `bg-${themeColor}-600 text-white shadow-lg scale-105`
                : `bg-white/70 backdrop-blur-sm border border-${themeColor}-400 text-${themeColor}-700 hover:bg-${themeColor}-100 hover:scale-105`
            }`}
          >
            {tab === "viewCertificates" ? "View Certificates" : "Send Request"}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="p-6 flex flex-col md:flex-row gap-6 mt-6">
        {activeTab === "viewCertificates" && (
          <>
            {/* Certificate List */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCertificate(cert)}
                  className={`cursor-pointer p-4 rounded-xl shadow-lg hover:shadow-2xl transition bg-white/70 backdrop-blur-lg border border-indigo-200 hover:scale-[1.02] ${
                    selectedCertificate?.id === cert.id ? `border-${themeColor}-500 bg-${themeColor}-50` : ""
                  }`}
                >
                  <h3 className={`font-semibold text-${themeColor}-700`}>{cert.title}</h3>
                </div>
              ))}
            </div>

            {/* Certificate Preview */}
            <div className="w-full md:w-2/3 bg-white/70 backdrop-blur-lg rounded-xl shadow-xl p-6 flex flex-col items-center justify-center relative">
              {selectedCertificate ? (
                <>
                  <h2 className={`text-2xl font-bold text-${themeColor}-700 mb-4`}>
                    {selectedCertificate.title}
                  </h2>
                  <iframe
                    src={selectedCertificate.fileUrl}
                    title="Certificate Preview"
                    className="w-full h-[450px] border border-indigo-300 rounded-lg mb-4 shadow"
                  ></iframe>
                  <Button
                    size="icon"
                    className="absolute bottom-6 right-6 rounded-full p-3 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:scale-110 transition"
                    onClick={() => handleDownload(selectedCertificate.fileUrl)}
                  >
                    <Download size={22} />
                  </Button>
                </>
              ) : (
                <p className="text-gray-600 text-lg">Select a certificate to preview</p>
              )}
            </div>
          </>
        )}

        {activeTab === "sendRequest" && (
          <div className="w-full md:w-2/3 mx-auto bg-white/70 backdrop-blur-lg rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">Certificate Request Form</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Request sent to admin!");
              }}
              className="flex flex-col gap-4"
            >
              {["Name", "Course Name", "Company Name"].map((placeholder) => (
                <input
                  key={placeholder}
                  type="text"
                  placeholder={placeholder}
                  className="border p-3 rounded-lg border-indigo-300 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 transition"
                  required
                />
              ))}
              <div className="flex gap-4 flex-wrap">
                {["Start Date", "Completion Date"].map((placeholder) => (
                  <input
                    key={placeholder}
                    type="date"
                    placeholder={placeholder}
                    className="border p-3 rounded-lg border-indigo-300 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 transition flex-1"
                    required
                  />
                ))}
              </div>
              <Button
                type="submit"
                className="bg-indigo-600 text-white hover:bg-indigo-700 flex justify-center rounded-lg shadow-md hover:scale-105 transition"
              >
                Send Request
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
