import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationMarker = ({ setLocation }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setLocation({ type: "Point", coordinates: [lng, lat] });
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
};

const LocationPicker = ({ setLocation }) => {
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default India

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setMapCenter(coords);
        setLocation({
          type: "Point",
          coordinates: [pos.coords.longitude, pos.coords.latitude],
        });
      },
      () => console.log("Geolocation not available")
    );
  }, []);

  return (
    <div className="relative h-60 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-700">
      <MapContainer center={mapCenter} zoom={13} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker setLocation={setLocation} />
      </MapContainer>
      <button
        onClick={() => {
          navigator.geolocation.getCurrentPosition((pos) => {
            const coords = [pos.coords.latitude, pos.coords.longitude];
            setMapCenter(coords);
            setLocation({
              type: "Point",
              coordinates: [pos.coords.longitude, pos.coords.latitude],
            });
          });
        }}
        className="absolute top-2 right-2 bg-white rounded-full shadow p-2 hover:bg-gray-200"
        title="Use current location"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1zm8-1h-2.05a6.978 6.978 0 00-1.075-2.489l1.454-1.454a1 1 0 00-1.414-1.414l-1.454 1.454A6.978 6.978 0 0013 5.05V3a1 1 0 00-2 0v2.05a6.978 6.978 0 00-2.489 1.075L7.05 4.671a1 1 0 00-1.414 1.414l1.454 1.454A6.978 6.978 0 005.05 11H3a1 1 0 000 2h2.05a6.978 6.978 0 001.075 2.489l-1.454 1.454a1 1 0 101.414 1.414l1.454-1.454A6.978 6.978 0 0011 18.95V21a1 1 0 002 0v-2.05a6.978 6.978 0 002.489-1.075l1.454 1.454a1 1 0 101.414-1.414l-1.454-1.454A6.978 6.978 0 0018.95 13H21a1 1 0 100-2z" />
        </svg>
      </button>
    </div>
  );
};

export default LocationPicker;
