import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import axios from 'axios';

const MapView = () => {
  const [complaints, setComplaints] = useState([]);
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946 });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = pos.coords;
        setLocation({ lat: coords.latitude, lng: coords.longitude });
        fetchNearby(coords.latitude, coords.longitude);
      },
      () => fetchNearby(location.lat, location.lng)
    );
  }, []);

  const fetchNearby = async (lat, lng) => {
    const token = localStorage.getItem('token');
    const res = await axios.get(
      `http://localhost:5000/api/complaints/nearby?lat=${lat}&lng=${lng}&radius=3`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setComplaints(res.data);
  };

  return (
    <MapContainer center={[location.lat, location.lng]} zoom={14} style={{ height: '500px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {complaints.map(c => (
        <Marker key={c._id} position={[c.location.coordinates[1], c.location.coordinates[0]]}>
          <Popup>
            <strong>{c.title}</strong><br />
            {c.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
