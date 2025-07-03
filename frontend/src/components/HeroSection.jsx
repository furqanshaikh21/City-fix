import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // import auth

export default function HeroSection() {
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  return (
    <section className="bg-white py-16 px-6 md:px-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left Content */}
        <div className="space-y-0">
          <h1 className="text-[60px] font-[700] leading-tight text-gray-900">
            <span className="block">Make Your City</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
              Better
            </span>
          </h1>
          <p className="text-lg mt-2 text-gray-600 max-w-xl">
            Report and track municipal issues in your community. Together we can improve our neighborhoods.
          </p>
          <div className="flex flex-wrap mt-10 items-center gap-4">
            {isAdmin ? (
              <button
                disabled
                title="Admins cannot submit issues"
                className="bg-gray-300 text-gray-500 px-6 py-3 rounded-md text-sm font-semibold cursor-not-allowed"
              >
                Report an Issue 📍
              </button>
            ) : (
              <Link
                to="/submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md"
              >
                Report an Issue 📍
              </Link>
            )}
            <Link
              to="/heatmap"
              className="bg-gray-200 border border-gray-300 text-gray-800 px-6 py-3 rounded-md text-sm font-semibold hover:bg-gray-300 transition-all duration-200 shadow-sm"
            >
              View Map →
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full">
          <img
            src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=1074&q=80"
            alt="Smart City Platform"
            className="rounded-md shadow-xl w-full"
          />
        </div>
      </div>
    </section>
  );
}
