
import { GoogleMap, useLoadScript, HeatmapLayerF } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import axios from '../utils/axios';

const mapContainerStyle = {
  width: '100%',
  height: '80vh',
};
const BANGALORE_BOUNDS = {
  north: 13.1500,
  south: 12.7500,
  west: 77.4000,
  east: 77.8000,
};

const libraries = ['visualization']; // for heatmap
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  
  restriction: {
    latLngBounds: BANGALORE_BOUNDS,
    strictBounds: true,
  },
};


const HeatmapView = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB8Z-9vlITIqlvT_PBb-xLGcOGse8lLimE',
    libraries,
  });

setTimeout(() => {
  if (mapRef.current && bounds.isValid()) {
    mapRef.current.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
  }
}, 300);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
    const res = await axios.get('http://localhost:5000/api/complaints/heatmap-data');

        const mapped = res.data.map((point) => ({
          location: new window.google.maps.LatLng(point.lat, point.lng),
          weight: point.intensity,
        }));

        // Fit bounds to data
        const bounds = new window.google.maps.LatLngBounds();
        mapped.forEach(({ location }) => bounds.extend(location));

        setHeatmapData(mapped);
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.fitBounds(bounds);
          }
        }, 200);
      } catch (err) {
        console.error('Error loading heatmap data:', err);
        // Optional fallback sample
        setHeatmapData([
          {
            location: new window.google.maps.LatLng(12.8325, 77.6552),
            weight: 120,
          },
          {
            location: new window.google.maps.LatLng(12.8330, 77.6565),
            weight: 90,
          },
        ]);
      }
    };

    if (isLoaded && window.google) {
      fetchHeatmapData();
    }
  }, [isLoaded]);

  if (loadError) return <p className="text-red-500 text-center mt-10">Error loading map</p>;
  if (!isLoaded) return <p className="text-center mt-10">Loading Map...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Complaint Heatmap</h2>
  <GoogleMap
  mapContainerStyle={mapContainerStyle}
  zoom={12}
  center={{ lat: 12.9716, lng: 77.5946 }} // ✅ Set Bangalore's center here
  options={mapOptions}
  onLoad={(map) => (mapRef.current = map)}
>

        {heatmapData.length > 0 && (
         <HeatmapLayerF
  data={heatmapData}
  options={{
    radius: 50, // Bigger coverage per point
    opacity: 0.85, // Stronger visibility
    dissipating: true,
    gradient: [
      'rgba(102, 255, 255, 0)',
      'rgba(102, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(255, 0, 255, 1)',
      'rgba(255, 0, 191, 1)',
      'rgba(255, 0, 127, 1)',
      'rgba(255, 0, 63, 1)',
      'rgba(255, 0, 0, 1)',
      'rgba(128, 0, 0, 1)', // Deep red for extreme intensity
    ],
  }}
/>

        )}
      </GoogleMap>
    </div>
  );
};

export default HeatmapView;
