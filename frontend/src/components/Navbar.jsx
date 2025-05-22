import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Flame,
  ThumbsUp,
  ShieldCheck,
  Users,
  LayoutDashboard,
  LogInIcon,
  UserPlus2,
  User,
  LogOut
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user/profile");
        setUser(res.data);
      } catch (err) {
        setUser(null); // not logged in
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        🛠️ SmartCity CMS
      </Link>

      <nav className="space-x-2 flex flex-wrap justify-center">
        <NavLink to="/" label="Home" icon={<MapPin size={18} />} />
        <NavLink to="/complaints" label="Complaints" icon={<ThumbsUp size={18} />} />
        <NavLink to="/submit" label="Submit" icon={<ShieldCheck size={18} />} />
        <NavLink to="/heatmap" label="Heatmap" icon={<Flame size={18} />} />
        <NavLink to="/volunteer" label="Volunteer" icon={<Users size={18} />} />
        {user && (
          <>
            <NavLink to="/dashboard" label="Dashboard" icon={<LayoutDashboard size={18} />} />
            <NavLink to="/profile" label="Profile" icon={<User size={18} />} />
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-medium tracking-wide bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-300"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        )}
        {!user && (
          <>
            <NavLink to="/login" label="Login" icon={<LogInIcon size={18} />} />
            <NavLink to="/register" label="Register" icon={<UserPlus2 size={18} />} />
          </>
        )}
      </nav>
    </header>
  );
};

const NavLink = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-medium tracking-wide ${
        isActive
          ? "bg-blue-600 text-white shadow-md dark:bg-blue-700"
          : "hover:bg-blue-100 dark:hover:bg-blue-800 text-gray-700 dark:text-gray-200"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
};

export default Navbar;
