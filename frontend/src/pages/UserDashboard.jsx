// src/pages/UserDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/complaints/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching user complaints", err);
      setError("Failed to fetch your complaints.");
    }
  };

  const verifyComplaint = async (id, feedback) => {
    try {
      setLoadingId(id);
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/verify`,
        { feedback },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchMyComplaints();
    } catch (err) {
      console.error("Verification failed", err);
      alert("Could not verify the complaint 😢");
    } finally {
      setLoadingId(null);
    }
  };

  const statusColor = {
    "Pending": "bg-yellow-600 text-white",
    "In Progress": "bg-blue-600 text-white",
    "Resolved": "bg-green-600 text-white",
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto bg-white text-gray-800 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold"> My Complaints</h2>
          <p className="text-gray-500">All your submitted complaints are listed here</p>
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {complaints.length === 0 ? (
        <p className="text-gray-500">No complaints submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((c) => (
            <div key={c._id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {c.media?.[0] && (
                <img
                  src={`http://localhost:5000${c.media[0]}`}
                  alt="Complaint Media"
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">{c.title}</h2>
                    <span className={`text-xs px-3 py-1 rounded-full ${statusColor[c.isResolved ? "Resolved" : c.status]}`}>
                      {c.isResolved ? "Resolved" : c.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mt-2">{c.description}</p>

                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <p>📍 <strong>Address:</strong> {c.address}</p>
                    <p>🏷️ <strong>Category:</strong> {c.category}</p>
                    <p>🔥 <strong>Severity:</strong> {c.severity}</p>
                    <p>📈 <strong>Upvotes:</strong> {c.upvotes?.length || 0}</p>
                    <p>🔍 <strong>Verification:</strong> {c.verificationStatus || "Not Verified"}</p>
                  </div>
                </div>

                {c.status === "In Progress" && c.verificationStatus === "Pending" && c.isResolved && (
                  <div className="mt-4 flex gap-2">
                    <button
                      disabled={loadingId === c._id}
                      onClick={() => verifyComplaint(c._id, "Confirmed")}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm disabled:opacity-50"
                    >
                      ✅ {loadingId === c._id ? "Submitting..." : "Confirm Resolved"}
                    </button>
                    <button
                      disabled={loadingId === c._id}
                      onClick={() => verifyComplaint(c._id, "Rejected")}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm disabled:opacity-50"
                    >
                      ❌ {loadingId === c._id ? "Submitting..." : "Reject Resolution"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
