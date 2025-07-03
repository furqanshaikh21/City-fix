// src/pages/AdminDashboard.jsx
import { useEffect, useState, useContext } from "react";
import axios from "../utils/axios";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/complaints", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComplaints(sorted);
    } catch (err) {
      console.error("Error fetching complaints", err);
      setError("Failed to fetch complaints.");
    }
  };

 const updateStatus = async (id, newStatus) => {
  try {
    setLoadingId(id);

    const token = localStorage.getItem("token");

    if (newStatus === "Resolved") {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/resolve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    fetchComplaints();
  } catch (err) {
    console.error("Error updating status", err);
    alert("Failed to update status");
  } finally {
    setLoadingId(null);
  }
};

  return (
    <div className="p-8 bg-white min-h-screen text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Complaint Dashboard</h1>

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.map((c) => (
          <div key={c._id} className="bg-white rounded-lg shadow border border-gray-200 flex flex-col overflow-hidden">
            {c.media?.[0] && (
              <img
                src={`http://localhost:5000${c.media[0]}`}
                alt="Complaint"
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{c.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{c.description}</p>

                <div className="text-sm text-gray-500 space-y-1">
                  <p><strong>📍 Address:</strong> {c.address}</p>
                  <p><strong>🏷️ Category:</strong> {c.category}</p>
                  <p><strong>🔥 Severity:</strong> {c.severity}</p>
                  <p><strong>👍 Upvotes:</strong> {c.upvotes?.length || 0}</p>
                  <p><strong>✅ Status:</strong> {c.isResolved ? "Resolved" : c.status}</p>
                  <p><strong>🔍 Verification:</strong> {c.verificationStatus || "N/A"}</p>
                </div>

                {c.createdBy && (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Submitted By:</h3>
                    <p className="text-sm text-gray-800"><strong>Name:</strong> {c.createdBy.name}</p>
                    <p className="text-sm text-gray-600"><strong>Email:</strong> {c.createdBy.email || "N/A"}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <select
                  onChange={(e) => updateStatus(c._id, e.target.value)}
                  value={c.status}
                  className="p-2 rounded bg-gray-100 text-gray-800 border border-gray-300"
                  disabled={c.verificationStatus === "Confirmed"}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                {loadingId === c._id && (
                  <p className="text-sm text-blue-500">Updating...</p>
                )}

                {c.verificationStatus === "Pending" && (
                  <p className="text-sm text-yellow-600 font-medium">Awaiting User Confirmation</p>
                )}

                {c.verificationStatus === "Confirmed" && (
                  <p className="text-sm text-green-600 font-medium">Verified by User</p>
                )}

                {c.verificationStatus === "Rejected" && (
                  <p className="text-sm text-red-600 font-medium">Rejected by User</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
