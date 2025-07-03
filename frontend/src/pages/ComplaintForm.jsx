// src/pages/ComplaintForm.jsx
import { useEffect, useRef, useState } from 'react';
import axios from '../utils/axios';

const categories = [
  'Road', 'Water', 'Electricity', 'Sanitation',
  'Public Transport', 'Safety', 'Other',
];

const ComplaintForm = () => {
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [location, setLocation] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const autocompleteRef = useRef();

  useEffect(() => {
    const initAutocomplete = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) return;
      const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
        types: ['geocode'],
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setLocation({
            type: 'Point',
            coordinates: [
              place.geometry.location.lng(),
              place.geometry.location.lat(),
            ],
            address: place.formatted_address,
          });
        }
      });
    };

    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB8Z-9vlITIqlvT_PBb-xLGcOGse8lLimE&libraries=places';
    script.async = true;
    script.onload = initAutocomplete;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const newErrors = {};

    if (files.length < 1) {
      newErrors.media = 'At least 1 image is required.';
    } else if (files.length > 3) {
      newErrors.media = 'You can upload a maximum of 3 images.';
    }

    const oversized = files.find(f => f.size > 3 * 1024 * 1024);
    if (oversized) {
      newErrors.media = 'Each image must be less than 3MB.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMediaFiles([]);
      setMediaPreviews([]);
      return;
    }

    setErrors(prev => ({ ...prev, media: null }));
    setMediaFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setMediaPreviews(previews);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.category.trim()) newErrors.category = 'Category is required';
    if (!location) newErrors.location = 'Location is required';
    if (mediaFiles.length < 1) newErrors.media = 'At least 1 image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validate()) return;

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    data.append('location', JSON.stringify(location));
    data.append('address', location.address);
    mediaFiles.forEach(file => data.append('media', file));

    try {
      await axios.post('/complaints', data);
      setMessage('✅ Complaint submitted successfully!');
      setForm({ title: '', description: '', category: '' });
      setLocation(null);
      setMediaFiles([]);
      setMediaPreviews([]);
      autocompleteRef.current.value = '';
      setErrors({});
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to submit complaint.');
    }
  };

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto bg-white text-gray-800 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Submit a Complaint</h2>

      {message && (
        <div className={`mb-4 px-4 py-2 rounded font-medium ${
          message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-500 outline-none`}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md border resize-none h-28 ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-500 outline-none`}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-500 outline-none`}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            ref={autocompleteRef}
            placeholder="Search address..."
            className={`w-full px-4 py-2 rounded-md border ${errors.location ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-500 outline-none`}
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Image (less than 3MB)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300"
          />
          {errors.media && <p className="text-red-500 text-sm">{errors.media}</p>}
          {mediaPreviews.length > 0 && (
            <div className="flex gap-3 mt-3">
              {mediaPreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Preview ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded border border-gray-400"
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
