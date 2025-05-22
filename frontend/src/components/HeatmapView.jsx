import { MapContainer, TileLayer } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import L from 'leaflet';

const HeatmapView = () => {
  const [heatLayer, setHeatLayer] = useState(null);
  const [center, setCenter] = useState([12.9716, 77.5946]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = pos.coords;
        setCenter([coords.latitude, coords.longitude]);
        fetchHeatmap(coords.latitude, coords.longitude);
      },
      () => fetchHeatmap(center[0], center[1])
    );
  }, []);

  const fetchHeatmap = async (lat, lng) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/complaints/heatmap`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    const points = data.map(p => [p.lat, p.lng, p.intensity]);

    if (heatLayer) heatLayer.remove();

    const layer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 18,
    });

    setHeatLayer(layer);
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '500px' }}
      whenCreated={map => {
        if (heatLayer) heatLayer.addTo(map);
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
};

export default HeatmapView;
