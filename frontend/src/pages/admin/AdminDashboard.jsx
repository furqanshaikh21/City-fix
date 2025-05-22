import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get('/api/admin/complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(data);
    } catch (err) {
      console.error('Error fetching complaints', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/api/admin/complaints/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchComplaints();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading complaints...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((comp) => (
              <tr key={comp._id} className="border-b">
                <td className="p-2 border">{comp.title}</td>
                <td className="p-2 border">{comp.address || `${comp.location?.lat}, ${comp.location?.lng}`}</td>
                <td className="p-2 border">{comp.status}</td>
                <td className="p-2 border">
                  <select
                    value={comp.status}
                    onChange={(e) => updateStatus(comp._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
