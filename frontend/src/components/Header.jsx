import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  AlertCircle,
  PlusCircle,
  ShieldCheck,
  Flame,
  Users,
  LogIn as LogInIcon,
  UserPlus,
  Menu,
  X,
  Sun,
  Moon,
  User,
} from "lucide-react";
import UserDropdown from "./UserDropdown";

const Header = () => {
  const location = useLocation();
  const { user, loading } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDarkMode = savedTheme ? savedTheme === "dark" : prefersDark;
    setDarkMode(initialDarkMode);
    document.documentElement.classList.toggle("dark", initialDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  if (loading) return <header className="h-16 bg-transparent" />;

  const NavLink = ({ to, icon, label, onClick }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`relative flex items-center px-3 py-2 text-sm font-medium transition-colors ${
          isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-500"
        }`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {isActive && (
          <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-blue-600 rounded-full" />
        )}
      </Link>
    );
  };

  const showForUser = user && user.role !== "admin";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link to="/" className="text-xl font-bold text-blue-700">CITY FIX</Link>

        <nav className="hidden md:flex items-center gap-x-4">
          <NavLink to="/" label="Home" icon={<LayoutDashboard size={18} />} />
       {user && (
  <>
    <NavLink to="/complaints" label="Complaints" icon={<AlertCircle size={18} />} />
    {showForUser && (
      <>
        <NavLink to="/submit" label="Form" icon={<PlusCircle size={18} />} />
        <NavLink to="/my-dashboard" label="My Dashboard" icon={<LayoutDashboard size={18} />} />
        <NavLink to="/verify-complaints" label="Verify" icon={<ShieldCheck size={18} />} />
      </>
    )}
    <NavLink to="/heatmap" label="Heatmap" icon={<Flame size={18} />} />
    {showForUser && (
      <NavLink to="/profile" label="Profile" icon={<User size={18} />} />
    )}
  </>
)}

          {user?.role === "admin" && (
            <NavLink to="/dashboard" label="Admin Dashboard" icon={<LayoutDashboard size={18} />} />
          )}
          {!user && (
            <>
              <NavLink to="/login" label="Login" icon={<LogInIcon size={18} />} />
              <NavLink to="/register" label="Register" icon={<UserPlus size={18} />} />
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          
          {user && <UserDropdown />}
        </div>

        <div className="md:hidden flex items-center space-x-3">
          <button onClick={toggleDarkMode} className="p-2 text-gray-500 hover:text-blue-500">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
          <NavLink to="/" label="Home" icon={<LayoutDashboard size={20} />} onClick={() => setMobileMenuOpen(false)} />
  {user && (
  <>
    <NavLink to="/complaints" label="Complaints" icon={<AlertCircle size={20} />} onClick={() => setMobileMenuOpen(false)} />
    {showForUser && (
      <>
        <NavLink to="/submit" label="Form" icon={<PlusCircle size={20} />} onClick={() => setMobileMenuOpen(false)} />
        <NavLink to="/my-dashboard" label="My Dashboard" icon={<LayoutDashboard size={20} />} onClick={() => setMobileMenuOpen(false)} />
        <NavLink to="/verify-complaints" label="Verify" icon={<ShieldCheck size={20} />} onClick={() => setMobileMenuOpen(false)} />
      </>
    )}
    <NavLink to="/heatmap" label="Heatmap" icon={<Flame size={20} />} onClick={() => setMobileMenuOpen(false)} />
    {showForUser && (
      <NavLink to="/profile" label="Profile" icon={<User size={20} />} onClick={() => setMobileMenuOpen(false)} />
    )}
  </>
)}

          {user?.role === "admin" && (
            <NavLink to="/dashboard" label="Admin Dashboard" icon={<LayoutDashboard size={20} />} onClick={() => setMobileMenuOpen(false)} />
          )}
          {!user && (
            <>
              <NavLink to="/login" label="Login" icon={<LogInIcon size={20} />} onClick={() => setMobileMenuOpen(false)} />
              <NavLink to="/register" label="Register" icon={<UserPlus size={20} />} onClick={() => setMobileMenuOpen(false)} />
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
