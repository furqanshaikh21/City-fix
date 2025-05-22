import { useEffect, useState, useContext } from 'react';
import axios from '../utils/axios';
import socket from '../utils/socket';
import { AuthContext } from '../context/AuthContext';
import { FaThumbsUp, FaCommentDots } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { reverseGeocode } from '../utils/geocode';

const ComplaintList = () => {
    const [complaints, setComplaints] = useState([]);
    const [enrichedComplaints, setEnrichedComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const complaintsPerPage = 5;
    const { user } = useContext(AuthContext);

    const statuses = ['Pending', 'In Progress', 'Resolved'];
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
        return () => {
            socket.off('newComplaint');
            socket.off('statusUpdate');
        };
    }, []);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        const enrichLocations = async () => {
            if (complaints.length === 0) {
                setEnrichedComplaints([]);
                return;
            }

            const currentComplaintsCopy = [...complaints];
            for (let i = 0; i < currentComplaintsCopy.length; i++) {
                const c = currentComplaintsCopy[i];
                if (c.location?.coordinates && !c.address) {
                    const [lng, lat] = c.location.coordinates;
                    // try {
                    //     const address = await reverseGeocode(lat, lng);
                    //     currentComplaintsCopy[i] = { ...c, address };
                    //     setEnrichedComplaints([...currentComplaintsCopy]);
                    // } catch (error) {
                    //     console.error(`Error geocoding for ${lat}, ${lng}:`, error);
                    //     currentComplaintsCopy[i] = { ...c, address: 'Address Failed' };
                    //     setEnrichedComplaints([...currentComplaintsCopy]);
                    // }
                    // await delay(600);
                }
            }
            setEnrichedComplaints(currentComplaintsCopy);
        };

        enrichLocations();
    }, [complaints]);

    useEffect(() => {
        let filtered = enrichedComplaints;

        if (selectedStatus) {
            filtered = filtered.filter(c => c.status === selectedStatus);
        }

        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(c =>
                c.title?.toLowerCase().includes(searchTerm)
            );
        }

        setFilteredComplaints(filtered);
        setCurrentPage(1);
    }, [enrichedComplaints, selectedStatus, searchTerm]);

    const indexOfLastComplaint = currentPage * complaintsPerPage;
    const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
    const currentComplaints = filteredComplaints.slice(indexOfFirstComplaint, indexOfLastComplaint);
    const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const vote = async (id) => {
        await axios.post(`/complaints/vote/${id}`);
        fetchComplaints();
    };

    const statusColor = {
        'Pending': 'bg-yellow-600 text-white',
        'In Progress': 'bg-blue-600 text-white',
        'Resolved': 'bg-green-600 text-white'
    };

    //For sorting by votes (Optional)...................................................
const [sortByVotes, setSortByVotes] = useState(false);
const [sortDirectionAsc, setSortDirectionAsc] = useState(false);

useEffect(() => {
    let filtered = enrichedComplaints;

    if (selectedStatus) {
        filtered = filtered.filter(c => c.status === selectedStatus);
    }

    if (searchTerm.trim() !== '') {
        filtered = filtered.filter(c =>
            c.title?.toLowerCase().includes(searchTerm)
        );
    }

   if (sortByVotes) {
    filtered = [...filtered].sort((a, b) => {
        const votesA = a.upvotes?.length || 0;
        const votesB = b.upvotes?.length || 0;
        return sortDirectionAsc ? votesA - votesB : votesB - votesA;
    });
}


    setFilteredComplaints(filtered);
    setCurrentPage(1);
}, [enrichedComplaints, selectedStatus, searchTerm, sortByVotes]);
//till here........................................................................................
    return (
        <div className="px-4 py-8 max-w-7xl mx-auto bg-gray-900 text-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold">Recent Issues</h2>
                    <p className="text-gray-400">Latest complaints reported in your area</p>
                </div>
                <Link to="/all-complaints" className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    View All Issues
                </Link>
            </div>

       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
  {/* Search + Sort */}
  <div className="flex flex-col sm:flex-row flex-1 gap-3 items-stretch sm:items-center">
    <input
      type="text"
      placeholder="Search complaints..."
      className="flex-grow px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
    />
    <button
      onClick={() => {
        setSortByVotes(true);
        setSortDirectionAsc((prev) => !prev); // Toggle direction
      }}
      className="w-full sm:w-auto px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center gap-2"
    >
      Sort by Votes {sortByVotes ? (sortDirectionAsc ? '↑' : '↓') : ''}
    </button>
  </div>

  {/* Status Filter Tabs */}
</div>


           <div className="flex  flex-wrap  px-2 py-2 w-full max-w-md sm:max-w-full sm:flex-nowrap rounded-md bg-gray-800">
  {['All', ...statuses].map((status) => (
    <button
      key={status}
      className={`px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
        selectedStatus === status || (status === 'All' && !selectedStatus)
          ? 'bg-white py-2 px-3 text-gray-900'
          : 'text-gray-300 hover:text-white hover:bg-gray-700'
      }`}
      onClick={() => setSelectedStatus(status === 'All' ? '' : status)}
    >
      {status}
    </button>
  ))}
</div>

            

            <div className="grid grid-cols-1 mt-7 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentComplaints.length === 0 ? (
                    <p className="text-center text-gray-400 col-span-full">No complaints found.</p>
                ) : (
                    currentComplaints.map(c => (
                        <div key={c._id} className="bg-gray-800 rounded-xl shadow border border-gray-700 hover:shadow-lg transition overflow-hidden">
                            {c.media && c.media.length > 0 && (
                                <img
                                    src={`${BACKEND_URL}${c.media[0]}`}
                                    alt={c.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold text-white">{c.title}</h3>
                                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[c.status]}`}>{c.status}</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1">{c.description}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                                    <MdLocationOn className="text-blue-400" />
                                  {c.address || 'Unknown Location'}



                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-xs bg-gray-700 rounded-full px-3 py-1">{c.category || 'Uncategorized'}</span>
                                    <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between mt-4 border-t border-gray-700 pt-2">
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1"><FaThumbsUp /> {c.upvotes?.length || 0}</div>
                                        <div className="flex items-center gap-1"><FaCommentDots /> {c.comments?.length || 0}</div>
                                    </div>
                                    <Link to={`/complaints/${c._id}`} className="text-blue-400 hover:underline">Details</Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center  mt-6 flex-wrap">
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx + 1}
                            onClick={() => paginate(idx + 1)}
                            className={`px-4 py-2 rounded-md ${
                                currentPage === idx + 1 ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-300'
                            }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ComplaintList;
