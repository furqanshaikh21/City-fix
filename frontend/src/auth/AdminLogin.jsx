import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { LogInIcon, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/admin/login", {
        username,
        password,
      });

      const { token, admin } = data;
      const adminUser = { ...admin, token, role: "admin" };

login(adminUser); // ✅ works with context
      navigate("/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      setError("❌ Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">🛡️ Admin Login</h2>
          <p className="text-sm text-gray-500">Authorized personnel only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <LogInIcon size={16} />
            Admin Log In
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm text-gray-600">
          <Link to="/login" className="hover:text-blue-600 transition">
            <UserPlus size={16} className="inline" /> User Login
          </Link>
          <Link to="/register" className="hover:text-blue-600 transition">
            <UserPlus size={16} className="inline" /> Register
          </Link>
        </div>
      </div>
    </div>
  );
}
