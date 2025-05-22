import { useState } from 'react';
import axios from 'axios';

const ComplaintCard = ({ complaint }) => {
  const [votes, setVotes] = useState(complaint.upvotes.length);

  const handleVote = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/complaints/${complaint._id}/vote`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVotes(res.data.votes);
    } catch (err) {
      console.error('Voting failed 💥', err);
    }
  };
  
const handleVerify = async (feedback) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(
      `http://localhost:5000/api/complaints/${complaint._id}/verify`,
      { feedback },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert(res.data.message);
  } catch (err) {
    console.error('Verification failed', err);
  }
};

  {complaint.isResolved && complaint.verificationStatus === 'Pending' && (
  <div className="mt-4 flex gap-2">
    <button
      onClick={() => handleVerify('Confirmed')}
      className="bg-green-600 text-white px-3 py-1 rounded"
    >
      ✅ Yes, fixed
    </button>
    <button
      onClick={() => handleVerify('Rejected')}
      className="bg-red-600 text-white px-3 py-1 rounded"
    >
      🔄 Still broken
    </button>
  </div>
)}

  return (
    

    
    <div className="bg-white p-4 rounded-xl shadow-md my-4">
      <h2 className="text-xl font-bold">{complaint.title}</h2>
      <p>{complaint.description}</p>
      <div className="flex justify-between mt-4">
        <button
          onClick={handleVote}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          👍 Upvote ({votes})
        </button>
        <span className="text-sm text-gray-500">
          Status: {complaint.status}
        </span>
      </div>
    </div>
    
  );
};

export default ComplaintCard;
