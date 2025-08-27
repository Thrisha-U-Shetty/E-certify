import { useState } from "react";
import { EyeIcon, ClipboardIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function UserRequests({ copyRequestToForm }) {
  const [requests, setRequests] = useState([
    { id: "REQ-101", name: "Alice Johnson", usn: "USN12345", courseTitle: "React", type: "Workshop", start: "2024-01-10", end: "2024-02-20" },
    { id: "REQ-102", name: "Bob Smith", usn: "USN54321", courseTitle: "Python Hackathon", type: "Hackathon", start: "2024-03-05", end: "2024-03-10" },
    { id: "REQ-103", name: "Carol Lee", usn: "USN67890", courseTitle: "Cultural Fest", type: "Cultural Event", start: "2024-04-15", end: "2024-04-20" },
    { id: "REQ-104", name: "David Kim", usn: "USN98765", courseTitle: "Tech Symposium", type: "Technical Event", start: "2024-05-01", end: "2024-05-05" }
  ]);

  const [expanded, setExpanded] = useState(null);

  const handleDelete = (id) => setRequests(requests.filter((req) => req.id !== id));

  const handleCopy = (req) => {
    copyRequestToForm(req); // autofills form and redirects to Create page
  };

  return (
    <div className="p-6 bg-white/70 backdrop-blur-lg rounded-xl shadow">
      <h2 className="text-xl font-bold text-indigo-700 mb-6">User Requests</h2>
      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="p-4 border border-indigo-200 rounded-lg bg-white shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{req.name}</p>
                <p className="text-sm text-gray-500">ID: {req.id}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setExpanded(expanded === req.id ? null : req.id)}
                  className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center justify-center"
                  title={expanded === req.id ? "Hide Details" : "View More"}
                >
                  <EyeIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={() => handleCopy(req)}
                  className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center justify-center"
                  title="Copy Details"
                >
                  <ClipboardIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={() => handleDelete(req.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                  title="Delete Request"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {expanded === req.id && (
              <div className="mt-4 text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Course / Event Name:</span> {req.courseTitle}</p>
                <p><span className="font-medium">Certification Type:</span> {req.type}</p>
                <p><span className="font-medium">USN:</span> {req.usn}</p>
                <p><span className="font-medium">Start Date:</span> {req.start}</p>
                <p><span className="font-medium">End Date:</span> {req.end}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
