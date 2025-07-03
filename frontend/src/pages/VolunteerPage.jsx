import { useEffect, useState } from 'react';
import axios from 'axios';

const VolunteerPage = () => {
  const [volunteer, setVolunteer] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/volunteer/me');
        setVolunteer(res.data);
        setIsRegistered(true);
        const comp = await axios.get('/api/complaints/volunteer');
        setComplaints(comp.data);
      } catch {
        setIsRegistered(false);
      }
    };
    fetchData();
  }, []);

  const registerAsVolunteer = async () => {
    try {
      const res = await axios.post('/api/volunteer/register');
      setVolunteer(res.data);
      setIsRegistered(true);
    } catch (err) {
      console.error('Registration failed', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold"> Volunteer Dashboard</h2>
      {!isRegistered ? (
        <button
          onClick={registerAsVolunteer}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register as Volunteer
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-green-600 font-medium">You're registered! Thank you 💙</p>
          <h3 className="text-xl font-semibold">Assigned Low-Risk Complaints:</h3>
          <ul className="space-y-3">
            {complaints.map((c, i) => (
              <li key={i} className="p-4 bg-white dark:bg-gray-800 shadow rounded">
                <h4 className="font-bold">{c.title}</h4>
                <p className="text-sm">{c.description}</p>
                <p className="text-xs text-gray-500">Status: {c.status}</p>
              </li>
            ))}
            {complaints.length === 0 && <p className="text-gray-400">No volunteer-tagged complaints yet.</p>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VolunteerPage;
