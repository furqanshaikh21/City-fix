// src/pages/admin/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
const { data } = await axios.post('http://localhost:5000/api/admin/login', { username, password });
    localStorage.setItem('adminToken', data.token);
    navigate('/admin/dashboard');
  } catch (err) {
    setError('❌ Invalid credentials');
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="bg-gray-900 dark:bg-gray-900 shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          🛡️ Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-400 outline-none dark:bg-gray-800 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-400 outline-none dark:bg-gray-800 dark:text-white"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Log In as Admin
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Not an admin?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Go to User Login
          </a>
        </div>
      </div>
    </div>
  );
}
