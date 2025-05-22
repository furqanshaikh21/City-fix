import { useEffect, useRef, useState } from 'react'; 
import axios from '../utils/axios';

const categories = [
  'Road',
  'Water',
  'Electricity',
  'Sanitation',
  'Public Transport',
  'Safety',
  'Other',
];

const ComplaintForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [location, setLocation] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const autocompleteRef = useRef();

  // ✅ Updated Google Maps Autocomplete logic only
useEffect(() => {
  const initAutocomplete = () => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps JavaScript API or Places library is not available.");
      return;
    }

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
  script.src =
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyB8Z-9vlITIqlvT_PBb-xLGcOGse8lLimE&libraries=places';
  script.async = true;
  script.onload = initAutocomplete;
  script.onerror = () => {
    console.error('Failed to load Google Maps script');
  };

  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.category.trim()) newErrors.category = 'Category is required';
    if (!location) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  const data = new FormData();
  Object.keys(form).forEach((key) => data.append(key, form[key]));

  data.append('location', JSON.stringify({
    type: location.type,
    coordinates: location.coordinates,
  }));
  data.append('address', location.address);

    if (file) data.append('media', file);

    try {
      await axios.post('/complaints', data);
      alert('Complaint submitted!');
      setForm({ title: '', description: '', category: '' });
      setLocation(null);
      autocompleteRef.current.value = '';
      setFile(null);
      setFilePreview(null);
      setErrors({});
    } catch (err) {
      console.error(err);
      alert('Error submitting complaint');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-xl dark:bg-zinc-800 rounded-xl">
      <h2 className="text-2xl font-semibold mb-6">Submit a Complaint</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <input
            name="title"
            onChange={handleChange}
            value={form.title}
            placeholder="Title"
            className={`input w-full ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <textarea
            name="description"
            onChange={handleChange}
            value={form.description}
            placeholder="Describe the issue..."
            className={`input w-full h-24 resize-none ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Category */}
        <div>
          <select
            name="category"
            onChange={handleChange}
            value={form.category}
            className={`input w-full ${errors.category ? 'border-red-500' : ''}`}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            placeholder="Search for location..."
            ref={autocompleteRef}
            className={`input w-full ${errors.location ? 'border-red-500' : ''}`}
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        {/* Media Upload */}
        <div>
          <label className="block mb-1 font-medium">Add Media</label>
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="input w-full" />
          {filePreview && (
            <img src={filePreview} alt="Preview" className="mt-3 rounded-lg max-h-48 object-contain" />
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-white text-black hover:bg-blue-100 rounded-md w-full py-3 text-lg font-semibold">
          Submit Complaint 
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
