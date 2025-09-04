
// import React, { useState } from "react";
// import { EyeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";

// export default function AllCertificates() {
//   const [selectedCert, setSelectedCert] = useState(null);

//   const certificates = [
//     {
//       id: 1,
//       name: "Alice Johnson",
//       courseTitle: "React",
//       type: "Bootcamp",
//       fileUrl: "/certificates/react.pdf",
//     },
//     {
//       id: 2,
//       name: "Bob Smith",
//       courseTitle: "Python",
//       type: "Workshop",
//       fileUrl: "/certificates/python.pdf",
//     },
//   ];

//   const handleDownload = (url) => {
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = url.split("/").pop();
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="p-6 bg-white/70 backdrop-blur-lg rounded-xl shadow min-h-screen flex flex-col md:flex-row gap-6">
//       {/* Left - Certificates List */}
//       <div className="w-full md:w-1/2">
//         <h2 className="text-xl font-bold text-indigo-700 mb-6">
//           All Certificates
//         </h2>
//         <div className="space-y-4">
//           {certificates.map((cert) => (
//             <div
//               key={cert.id}
//               className="flex justify-between items-center p-4 border border-indigo-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
//             >
//               {/* Certificate Info */}
//               <div>
//                 <p className="text-lg font-semibold text-gray-800">
//                   {cert.name}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   {cert.courseTitle} {cert.type} Certificate
//                 </p>
//               </div>

//               {/* Action - Eye Icon */}
//               <button
//                 onClick={() => setSelectedCert(cert)}
//                 className="p-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition flex items-center justify-center"
//                 title="View Certificate"
//               >
//                 <EyeIcon className="h-5 w-5" />
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right - Certificate Preview */}
//       <div className="w-full md:w-1/2 bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
//         {selectedCert ? (
//           <>
//             <h3 className="text-lg font-bold text-indigo-700 mb-4">
//               {selectedCert.name} - {selectedCert.courseTitle} {selectedCert.type}
//             </h3>
//             <iframe
//               src={selectedCert.fileUrl}
//               title="Certificate Preview"
//               className="w-full h-[25vh] md:h-[500px] border rounded"
//             ></iframe>
//             <button
//               onClick={() => handleDownload(selectedCert.fileUrl)}
//               className="mt-4 p-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition flex items-center justify-center"
//               title="Download Certificate"
//             >
//               <ArrowDownTrayIcon className="h-5 w-5" />
//             </button>
//           </>
//         ) : (
//           <p className="text-gray-600">Select a certificate to preview</p>
//         )}
//       </div>
//     </div>
//   );
// }



// import React, { useState } from "react";
// import { EyeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";

// import React, { useEffect, useState } from "react";
// import { EyeIcon } from "@heroicons/react/24/solid";
//  771ee7649bd8cfff6d22f74568b4165d616c5fbb

// export default function AllCertificates() {
//   const [certificates, setCertificates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCertificates = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/certificates/all");
//         const data = await res.json();
//         if (data.success) {
//           setCertificates(data.certificates);
//         } else {
//           setError(data.message || "Failed to load certificates");
//         }
//       } catch (err) {
//         setError(err.message || "Server error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCertificates();
//   }, []);

//   if (loading) return <p className="p-6">Loading certificates...</p>;
//   if (error) return <p className="p-6 text-red-600">{error}</p>;

//   return (
// < 
//     <div className="p-6 bg-black/90 backdrop-blur-xl rounded-xl shadow-xl min-h-screen flex flex-col md:flex-row gap-6">
//       {/* Left - Certificates List */}
//       <div className="w-full md:w-1/2">
//         <h2 className="text-2xl font-bold text-white mb-6">All Certificates</h2>
//         <div className="space-y-4">
//           {certificates.map((cert) => (
//             <div
//               key={cert.id}
//               className="flex justify-between items-center p-4 border border-gray-700 rounded-lg shadow-md bg-gray-800/80 hover:bg-gray-700/90 hover:shadow-lg transition"
//             >
//               {/* Certificate Info */}
//               <div>
//                 <p className="text-lg font-semibold text-white">{cert.name}</p>
//                 <p className="text-sm text-gray-300">
//                   {cert.courseTitle} {cert.type} Certificate
//                 </p>
//               </div>

//     <div className="p-6 bg-white/70 backdrop-blur-lg rounded-xl shadow min-h-screen">
//       <h2 className="text-xl font-bold text-indigo-700 mb-6">
//         All Certificates
//       </h2>
//  771ee7649bd8cfff6d22f74568b4165d616c5fbb

//       <div className="space-y-4">
//         {certificates.map((cert) => (
//           <div
//             key={cert.certId}
//             className="flex justify-between items-center p-4 border border-indigo-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
//           >
//             <div>
//               <p className="text-lg font-semibold text-gray-800">
//                 ID: {cert.certId}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Event Name: {cert.courseTitle} 
//               </p>
//               <p className="text-sm text-gray-600">Recipient: {cert.name}</p>
//             </div>


//       {/* Right - Certificate Preview */}
//       <div className="w-full md:w-1/2 bg-gray-800/90 rounded-xl shadow-md p-6 flex flex-col items-center justify-center border border-gray-700">
//         {selectedCert ? (
//           <>
//             <h3 className="text-lg font-bold text-white mb-4">
//               {selectedCert.name} - {selectedCert.courseTitle} {selectedCert.type}
//             </h3>
//             <iframe
//               src={selectedCert.fileUrl}
//               title="Certificate Preview"
//               className="w-full h-[25vh] md:h-[500px] border border-gray-700 rounded"
//             ></iframe>
// 771ee7649bd8cfff6d22f74568b4165d616c5fbb
//             <button
//               onClick={() => window.open(cert.ipfsUrl, "_blank")}
//               className="p-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition flex items-center justify-center"
//               title="View Certificate"
//             >
//               <EyeIcon className="h-5 w-5" />
//             </button>

//           </>
//         ) : (
//           <p className="text-gray-400">Select a certificate to preview</p>
//         )}

//           </div>
//         ))}
//  771ee7649bd8cfff6d22f74568b4165d616c5fbb
//       </div>
//     </div>
//   );
// }





// import React, { useEffect, useState } from "react";
// import { EyeIcon } from "@heroicons/react/24/solid";

// export default function AllCertificates() {
//   const [certificates, setCertificates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCertificates = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/certificates/all");
//         const data = await res.json();
//         if (data.success) {
//           setCertificates(data.certificates);
//         } else {
//           setError(data.message || "Failed to load certificates");
//         }
//       } catch (err) {
//         setError(err.message || "Server error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCertificates();
//   }, []);

//   if (loading) return <p className="p-6">Loading certificates...</p>;
//   if (error) return <p className="p-6 text-red-600">{error}</p>;

//   return (
//     <div className="p-6 bg-white/70 backdrop-blur-lg rounded-xl shadow min-h-screen">
//       <h2 className="text-xl font-bold text-indigo-700 mb-6">
//         All Certificates
//       </h2>

//       <div className="space-y-4">
//         {certificates.map((cert) => (
//           <div
//             key={cert.certId}
//             className="flex justify-between items-center p-4 border border-indigo-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
//           >
//             <div>
//               <p className="text-lg font-semibold text-gray-800">
//                 ID: {cert.certId}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Event Name: {cert.courseTitle} 
//               </p>
//               <p className="text-sm text-gray-600">Recipient: {cert.name}</p>
//             </div>

//             <button
//               onClick={() => window.open(cert.ipfsUrl, "_blank")}
//               className="p-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition flex items-center justify-center"
//               title="View Certificate"
//             >
//               <EyeIcon className="h-5 w-5" />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }










// import React, { useEffect, useState } from "react";
// import { EyeIcon } from "@heroicons/react/24/solid";

// export default function AllCertificates() {
//   const [certificates, setCertificates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCertificates = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/certificates/all");
//         const data = await res.json();
//         if (data.success) {
//           setCertificates(data.certificates);
//         } else {
//           setError(data.message || "Failed to load certificates");
//         }
//       } catch (err) {
//         setError(err.message || "Server error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCertificates();
//   }, []);

//   if (loading) return <p className="p-6 text-gray-300">Loading certificates...</p>;
//   if (error) return <p className="p-6 text-red-400">{error}</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
//       <div className="max-w-4xl mx-auto bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
//         <h2 className="text-2xl font-extrabold text-green-400 mb-6 text-center">
//           All Certificates
//         </h2>

//         <div className="space-y-4">
//           {certificates.map((cert) => (
//             <div
//               key={cert.certId}
//               className="flex justify-between items-center p-4 border border-green-500/40 rounded-xl shadow-md bg-gray-800/70 hover:shadow-lg hover:border-green-400 transition"
//             >
//               <div>
//                 <p className="text-lg font-semibold text-white">
//                   ID: {cert.certId}
//                 </p>
//                 <p className="text-sm text-gray-300">
//                   Event Name: {cert.courseTitle}
//                 </p>
//                 <p className="text-sm text-gray-300">
//                   Recipient: {cert.name}
//                 </p>
//               </div>

//               <button
//                 onClick={() => window.open(cert.ipfsUrl, "_blank")}
//                 className="p-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition flex items-center justify-center"
//                 title="View Certificate"
//               >
//                 <EyeIcon className="h-5 w-5" />
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }








// import React, { useEffect, useState } from "react";
// import { EyeIcon } from "@heroicons/react/24/solid";

// export default function AllCertificates() {
//   const [certificates, setCertificates] = useState([]);
//   const [filteredCertificates, setFilteredCertificates] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCertificates = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/certificates/all");
//         const data = await res.json();
//         if (data.success) {
//           setCertificates(data.certificates);
//           setFilteredCertificates(data.certificates);
//         } else {
//           setError(data.message || "Failed to load certificates");
//         }
//       } catch (err) {
//         setError(err.message || "Server error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCertificates();
//   }, []);

//   // Filter whenever search term changes
//   useEffect(() => {
//     const results = certificates.filter(
//       (cert) =>
//         cert.certId.toString().includes(searchTerm) ||
//         cert.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cert.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredCertificates(results);
//   }, [searchTerm, certificates]);

//   if (loading) return <p className="p-6 text-gray-300">Loading certificates...</p>;
//   if (error) return <p className="p-6 text-red-400">{error}</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
//       <div className="max-w-4xl mx-auto bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
//         <h2 className="text-2xl font-extrabold text-green-400 mb-6 text-center">
//           All Certificates
//         </h2>

//         {/* 🔍 Search Bar */}
//         <div className="mb-6 flex justify-center">
//           <input
//             type="text"
//             placeholder="Search by ID, Event, or Recipient"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full sm:w-2/3 px-4 py-2 rounded-lg bg-gray-800 text-white border border-green-500/40 focus:ring-2 focus:ring-green-400"
//           />
//         </div>

//         <div className="space-y-4">
//           {filteredCertificates.length > 0 ? (
//             filteredCertificates.map((cert) => (
//               <div
//                 key={cert.certId}
//                 className="flex justify-between items-center p-4 border border-green-500/40 rounded-xl shadow-md bg-gray-800/70 hover:shadow-lg hover:border-green-400 transition"
//               >
//                 <div>
//                   <p className="text-lg font-semibold text-white">
//                     ID: {cert.certId}
//                   </p>
//                   <p className="text-sm text-gray-300">
//                     Event Name: {cert.courseTitle}
//                   </p>
//                   <p className="text-sm text-gray-300">
//                     Recipient: {cert.name}
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => window.open(cert.ipfsUrl, "_blank")}
//                   className="p-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition flex items-center justify-center"
//                   title="View Certificate"
//                 >
//                   <EyeIcon className="h-5 w-5" />
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-400 text-center">No certificates found</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }











import React, { useEffect, useState } from "react";
import { EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function AllCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/certificates/all");
        const data = await res.json();
        if (data.success) {
          setCertificates(data.certificates);
          setFilteredCertificates(data.certificates);
        } else {
          setError(data.message || "Failed to load certificates");
        }
      } catch (err) {
        setError(err.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Filter whenever search term changes
  useEffect(() => {
    const results = certificates.filter(
      (cert) =>
        cert.certId.toString().includes(searchTerm) ||
        cert.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCertificates(results);
  }, [searchTerm, certificates]);

  if (loading) return <p className="p-6 text-gray-300">Loading certificates...</p>;
  if (error) return <p className="p-6 text-red-400">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-extrabold text-green-400 mb-6 text-center">
          All Certificates
        </h2>

        {/* 🔍 Search Bar with Icon Inside */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-full sm:w-2/3">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Certificate Id"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-green-500/40 focus:ring-2 focus:ring-green-400 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map((cert) => (
              <div
                key={cert.certId}
                className="flex justify-between items-center p-4 border border-green-500/40 rounded-xl shadow-md bg-gray-800/70 hover:shadow-lg hover:border-green-400 transition"
              >
                <div>
                  <p className="text-lg font-semibold text-white">
                    ID: {cert.certId}
                  </p>
                  <p className="text-sm text-gray-300">
                    Event Name: {cert.courseTitle}
                  </p>
                  <p className="text-sm text-gray-300">
                    Recipient: {cert.name}
                  </p>
                </div>

                <button
                  onClick={() => window.open(cert.ipfsUrl, "_blank")}
                  className="p-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition flex items-center justify-center"
                  title="View Certificate"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No certificates found</p>
          )}
        </div>
      </div>
    </div>
  );
}
