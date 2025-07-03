import { useEffect, useState, useContext } from 'react';
import axios from '../utils/axios';
import { AuthContext } from '../context/AuthContext';

const UserVerificationPage = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchComplaintsToVerify = async () => {
    try {
      const res = await axios.get('/complaints/my', {
        headers: { Authorization: `Bearer ${user.token}` },
      });

const toVerify = res.data.filter((c) => {
  return (
    c.isResolved === true &&  // ✅ Only if admin resolved it
    c.verificationStatus === 'Pending' &&
    c.createdBy?.toString() === user._id
  );
});

    console.log("🔍 Complaints from backend:", res.data); // ✅ See what's coming


      setComplaints(toVerify);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

  useEffect(() => {
    if (user?.token) fetchComplaintsToVerify();
  }, [user]);

  const handleFeedback = async (id, feedback) => {
    try {
      setLoadingId(id);
      await axios.put(`/complaints/${id}/verify`, { feedback }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchComplaintsToVerify();
    } catch (err) {
      console.error('Error verifying complaint:', err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-white text-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Verify Your Complaint Resolution</h2>

      {complaints.length === 0 ? (
        <p className="text-gray-500">No complaints to verify. All caught up!</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {complaints.map((c) => (
            <div key={c._id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              {c.media?.[0] && (
                <img
                  src={`http://localhost:5000${c.media[0]}`}
                  alt="Complaint"
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-800">{c.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{c.description}</p>
              <p className="text-sm text-gray-500 mt-2">📍 {c.address}</p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleFeedback(c._id, 'Confirmed')}
                  disabled={loadingId === c._id}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  ✅ Confirm
                </button>
                <button
                  onClick={() => handleFeedback(c._id, 'Rejected')}
                  disabled={loadingId === c._id}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserVerificationPage;
