import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogInIcon, ShieldCheck, UserPlus } from "lucide-react";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const userData = res.data.user || res.data;
      login(userData);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      navigate("/profile");
    } catch (err) {
      setError("⚠️ Login failed. Check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">Welcome Back</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please login to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-600 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600 dark:text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <LogInIcon size={18} />
            Log In
          </button>
        </form>

        <div className="mt-6 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <Link
            to="/register"
            className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <UserPlus size={16} />
            New User? Register
          </Link>
          <Link to="/admin-login" className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition">
  <ShieldCheck size={16} />
  Admin Login
</Link>

        </div>
      </div>
    </div>
  );
};

export default LogIn;
