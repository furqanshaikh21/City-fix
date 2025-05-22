import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ComplaintForm from "./pages/ComplaintForm";
import ComplaintList from "./pages/ComplaintList";
import HeatmapView from "./pages/HeatmapView";
import VolunteerPage from "./pages/VolunteerPage";
import LogIn from "./auth/LogIn";
import Register from "./auth/Register";
import ProfilePage from "./pages/ProfilePage";
import UserDropdown from "./components/UserDropdown";
import AdminLogin from "./auth/AdminLogin";

import { 
  MapPin, 
  Flame, 
  AlertCircle, 
  ShieldCheck, 
  Users, 
  LayoutDashboard, 
  LogIn as LogInIcon, 
  UserPlus, 
  User,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  ChevronDown
} from "lucide-react";

const App = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New complaint reported in Downtown area", read: false },
    { id: 2, text: "Your complaint #1234 has been resolved", read: false },
    { id: 3, text: "3 volunteers joined your cleanup initiative", read: true }
  ]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // This explicitly adds/removes the class from the HTML element
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  useEffect(() => {
    // Initialize dark mode based on user preferences
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Set the tailwind dark mode strategy to class instead of media
    document.documentElement.setAttribute('data-theme', 'class');
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;
const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <div className={`min-h-screen  font-sans ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen   bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
        {/* Header */}
        <header
  className={`sticky top-0 z-50 shadow-sm transition-colors duration-300 ${
    isScrolled ? 'bg-white/60 backdrop-blur-md dark:bg-gray-800/80' : 'bg-transparent'
  }`}
>
          <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center">
                  <div className="h-10 w-10 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                    <MapPin size={24} />
                  </div>
                  <span className="ml-2 text-xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 text-transparent bg-clip-text">CityFix</span>
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                <NavLink to="/" label="Home" icon={<MapPin size={18} />} />
                <NavLink to="/complaints" label="Complaints" icon={<AlertCircle size={18} />} />
                <NavLink to="/submit" label="Report Issue" icon={<ShieldCheck size={18} />} />
                <NavLink to="/heatmap" label="Issue Map" icon={<Flame size={18} />} />
                <NavLink to="/volunteer" label="Volunteer" icon={<Users size={18} />} />
                <NavLink to="/dashboard" label="Dashboard" icon={<LayoutDashboard size={18} />} />
              </nav>
              
              {/* Right side actions */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Dark mode toggle */}
                <button 
                  onClick={toggleDarkMode} 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                
                {/* Notifications */}
                <div className="relative">
                  <button 
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                  >
                    <Bell size={20} />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-0 right-0 h-5 w-5 text-xs flex items-center justify-center bg-teal-500 text-white rounded-full">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                  
                  {/* Dropdown for notifications */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-medium">
                        Notifications
                      </div>
                      {notifications.length > 0 ? (
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map(notification => (
                            <div 
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'bg-teal-50 dark:bg-teal-900/20' : ''}`}
                            >
                              <p className="text-sm">{notification.text}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 hour ago</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          No notifications
                        </div>
                      )}
                      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                        <button className="text-xs text-teal-600 dark:text-teal-400 hover:underline">
                          Mark all as read
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User dropdown */}
                {/* <div className="relative">
                  <button 
                    className="flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1 pr-2 transition-colors"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white">
                      <User size={16} />
                    </div>
                    <ChevronDown size={16} className={`transform transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link 
                        to="/login" 
                        className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Register
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div> */}
                <UserDropdown />
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center space-x-4">
                <button 
                  onClick={toggleDarkMode} 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  aria-expanded={mobileMenuOpen}
                  aria-label="Main menu"
                >
                  {mobileMenuOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <MobileNavLink to="/" label="Home" icon={<MapPin size={18} />} onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/complaints" label="Complaints" icon={<AlertCircle size={18} />} onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/submit" label="Report Issue" icon={<ShieldCheck size={18} />} onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/heatmap" label="Issue Map" icon={<Flame size={18} />} onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/volunteer" label="Volunteer" icon={<Users size={18} />} onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/dashboard" label="Dashboard" icon={<LayoutDashboard size={18} />} onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/login" label="Login" icon={<LogInIcon size={18} />} onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/register" label="Register" icon={<UserPlus size={18} />} onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/profile" label="Profile" icon={<User size={18} />} onClick={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          )}
        </header>
        
        {/* Main content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/submit" element={<ComplaintForm />} />
              <Route path="/complaints" element={<ComplaintList />} />
              <Route path="/heatmap" element={<HeatmapView />} />
              <Route path="/volunteer" element={<VolunteerPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin-login" element={<AdminLogin />} />
            </Routes>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 shadow-inner py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">About CityFix</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Making our communities better through citizen-powered issue reporting and resolution.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
                <ul className="mt-2 space-y-2">
                  <li>
                    <Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
                <ul className="mt-2 space-y-2">
                  <li>
                    <Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                © {new Date().getFullYear()} CityFix. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const NavLink = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`inline-flex items-center px-3 py-2 rounded-lg transition-all ${
        isActive
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-medium"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const MobileNavLink = ({ to, label, icon, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-3 py-3 rounded-lg ${
        isActive
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-medium"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default App;