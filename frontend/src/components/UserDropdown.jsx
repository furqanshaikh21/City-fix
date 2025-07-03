import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserDropdown = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <div className="relative">
      <button 
        className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1 pr-3 transition"
        onClick={() => setUserDropdownOpen(prev => !prev)}
      >
        <div className="h-9 w-9 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-sm">
          <User size={18} />
        </div>
        <ChevronDown 
          size={16} 
          className={`text-black transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {userDropdownOpen && (
        <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-xl shadow-lg z-20 border border-gray-200 overflow-hidden">
          {user ? (
            <>
              <Link 
                to="/profile"
                className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                onClick={() => setUserDropdownOpen(false)}
              >
                Profile
              </Link>
              <div className="border-t border-gray-200" />
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100 transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                onClick={() => setUserDropdownOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                onClick={() => setUserDropdownOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
