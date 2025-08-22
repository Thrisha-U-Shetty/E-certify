import { useState } from "react";

export default function UserRequests() {
  const [requests, setRequests] = useState([
    {
      id: "REQ-101",
      name: "Alice Johnson",
      courseTitle: "React",
      type: "Bootcamp",
      start: "2024-01-10",
      end: "2024-02-20",
      issuedBy: "E-Certify Institute",
    },
    {
      id: "REQ-102",
      name: "Bob Smith",
      courseTitle: "Python",
      type: "Workshop",
      start: "2024-03-05",
      end: "2024-03-10",
      issuedBy: "E-Certify Institute",
    },
  ]);

  const [expanded, setExpanded] = useState(null);

  const handleDelete = (id) => {
    setRequests(requests.filter((req) => req.id !== id));
  };

  const handleCopy = (req) => {
    alert(`Copying details of ${req.name} (${req.id}) to Create Page`);
  };

  return (
    <div className="p-6 bg-white/70 backdrop-blur-lg rounded-xl shadow">
      <h2 className="text-xl font-bold text-indigo-700 mb-6">User Requests</h2>

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="p-4 border border-indigo-200 rounded-lg bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{req.name}</p>
                <p className="text-sm text-gray-500">ID: {req.id}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setExpanded(expanded === req.id ? null : req.id)
                  }
                  className="px-3 py-1 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                >
                  {expanded === req.id ? "Hide" : "View More"}
                </button>
                <button
                  onClick={() => handleCopy(req)}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  Copy
                </button>
                <button
                  onClick={() => handleDelete(req.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>

            {expanded === req.id && (
              <div className="mt-4 text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">Course Name:</span>{" "}
                  {req.courseTitle}
                </p>
                <p>
                  <span className="font-medium">Course Type:</span> {req.type}
                </p>
                <p>
                  <span className="font-medium">Start Date:</span> {req.start}
                </p>
                <p>
                  <span className="font-medium">End Date:</span> {req.end}
                </p>
                <p>
                  <span className="font-medium">Issued By:</span> {req.issuedBy}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
