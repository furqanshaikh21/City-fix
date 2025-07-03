import { useEffect, useState, useContext } from 'react';
import axios from '../utils/axios';
import socket from '../utils/socket';
import { AuthContext } from '../context/AuthContext';
import { FaThumbsUp, FaCommentDots } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByVotes, setSortByVotes] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 5;
  const { user } = useContext(AuthContext);
  const BACKEND_URL = 'http://localhost:5000';

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('/complaints');
      setComplaints(res.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  useEffect(() => {
    fetchComplaints();
    socket.on('newComplaint', fetchComplaints);
    socket.on('statusUpdate', fetchComplaints);
    socket.on('voteUpdate', fetchComplaints);

    return () => {
      socket.off('newComplaint');
      socket.off('statusUpdate');
      socket.off('voteUpdate');
    };
  }, []);

  useEffect(() => {
    let updated = [...complaints];

    if (selectedStatus) {
      updated = updated.filter((c) => {
        const status = c.isResolved && c.verificationStatus === 'Confirmed' ? 'Resolved' : c.status;
        return status === selectedStatus;
      });
    }

    if (searchTerm) {
      updated = updated.filter((c) => c.title?.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (sortByVotes) {
      updated.sort((a, b) => {
        const votesA = a.upvotes?.length || 0;
        const votesB = b.upvotes?.length || 0;
        return sortAsc ? votesA - votesB : votesB - votesA;
      });
    }

    setFilteredComplaints(updated);
    setCurrentPage(1);
  }, [complaints, selectedStatus, searchTerm, sortByVotes, sortAsc]);

  const vote = async (id) => {
    try {
      if (!user?.token) return alert('Login required to vote!');
      if (user?.role === 'admin') return alert("Admins can't vote 😅");

      await axios.put(
        `/complaints/${id}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
    } catch (err) {
      console.error('Vote error:', err);
      alert('Failed to vote 😢');
    }
  };

  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
  const start = (currentPage - 1) * complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(start, start + complaintsPerPage);

  const statusColor = {
    'Pending': 'bg-yellow-600 text-white',
    'In Progress': 'bg-blue-600 text-white',
    'Resolved': 'bg-green-600 text-white'
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto bg-white text-gray-800 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Recent Issues</h2>
          <p className="text-gray-500">Latest complaints reported in your area</p>
        </div>
        <Link to="/all-complaints" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">
          View All Issues
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="flex-grow px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => {
            setSortByVotes(true);
            setSortAsc((prev) => !prev);
          }}
          className="bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-200"
        >
          Sort by Votes {sortByVotes ? (sortAsc ? '↑' : '↓') : ''}
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-md text-sm ${
              (selectedStatus === status || (status === 'All' && !selectedStatus))
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 border border-gray-300'
            }`}
            onClick={() => setSelectedStatus(status === 'All' ? '' : status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentComplaints.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">No complaints found.</p>
        ) : (
          currentComplaints.map((c) => {
            const status = c.isResolved && c.verificationStatus === 'Confirmed' ? 'Resolved' : c.status;

            return (
              <div key={c._id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                {c.media?.[0] && (
                  <img
                    src={`${BACKEND_URL}${c.media[0]}`}
                    alt="Complaint"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{c.title}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full ${statusColor[status]}`}>
                      {status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{c.description}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <MdLocationOn className="text-blue-500 mr-1" />
                    {c.address || 'Unknown location'}
                  </div>
                  <div className="flex justify-between items-center mt-4 text-sm">
                    <span className="text-xs bg-gray-200 px-3 py-1 rounded-full">
                      {c.category}
                    </span>
                    <span className="text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 border-t pt-3 border-gray-200 text-sm">
                    <div className="flex items-center gap-4">
                      {user?.role === 'admin' ? (
                        <div className="flex items-center gap-1 text-gray-400 cursor-not-allowed" title="Admins cannot vote">
                          <FaThumbsUp /> {c.upvotes?.length || 0}
                        </div>
                      ) : (
                        <div
                          onClick={() => vote(c._id)}
                          className="flex items-center gap-1 cursor-pointer hover:text-blue-600"
                          title="Upvote"
                        >
                          <FaThumbsUp /> {c.upvotes?.length || 0}
                        </div>
                      )}
                      {/* <div className="flex items-center gap-1 text-gray-600">
                        <FaCommentDots /> {c.comments?.length || 0}
                      </div> */}
                    </div>
                    {/* <Link to={`/complaints/${c._id}`} className="text-blue-600 hover:underline">
                      Details
                    </Link> */}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 border border-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintList;
