import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ChevronDown } from 'lucide-react';

const UserDropdown = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token'); // Replace with real auth check
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <div className="relative">
      <button 
        className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1 pr-3 transition"
        onClick={() => setUserDropdownOpen(prev => !prev)}
      >
        <div className="h-9 w-9 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-sm">
          <User size={18} />
        </div>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {userDropdownOpen && (
        <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-20 border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoggedIn && (
            <>
              <Link 
                to="/profile"
                className="block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={() => setUserDropdownOpen(false)}
              >
                Profile
              </Link>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link 
                to="/login"
                className="block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={() => setUserDropdownOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={() => setUserDropdownOpen(false)}
              >
                Register
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700" />
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
