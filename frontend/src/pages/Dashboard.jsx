// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000'); // Ensure backend is running

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
    socket.on('newComplaint', () => fetchComplaints());
    return () => socket.off('newComplaint');
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/complaints');
      if (Array.isArray(res.data)) {
        setComplaints(res.data);
        setFilteredComplaints(res.data);
      } else {
        setComplaints([]);
        setFilteredComplaints([]);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Complaint Dashboard</h1>
      <div className="grid grid-cols-1 gap-4">
        {filteredComplaints.map((complaint) => (
          <div key={complaint._id} className="p-4 border rounded shadow">
            <h2 className="font-semibold">{complaint.title}</h2>
            <p>{complaint.description}</p>
            <p className="text-sm text-gray-500">Status: {complaint.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
