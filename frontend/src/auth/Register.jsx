import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);

      navigate('/login');
    } catch (err) {
      setError('Registration failed. Try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">📝 Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name"
          className="w-full px-3 py-2 border rounded" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email"
          className="w-full px-3 py-2 border rounded" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password"
          className="w-full px-3 py-2 border rounded" required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Register</button>
      </form>
    </div>
  );
};

export default Register;