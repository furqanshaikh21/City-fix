import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br mt-20  from-gray-900 to-gray-900 py-0 px-6 md:px-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        
        {/* Left Content */}
        <div className="space-y-0">
          <h1 className="text-[60px]  font-[700] leading-tight text-gray-100">
            <span className="block">Make Your City</span>
            <span className="block text-transparent bg-clip-text  bg-gradient-to-r from-blue-400 to-indigo-500">
              Better
            </span>
          </h1>
          <p className="text-lg mt-2 text-gray-300 max-w-xl">
            Report and track municipal issues in your community. Together we can improve our neighborhoods.
          </p>
          <div className="flex flex-wrap mt-10 items-center gap-4">
            <Link
              to="/submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md"
            >
              Report an Issue 📍
            </Link>
            <Link
              to="/heatmap"
              className="bg-gray-700 border border-gray-600 text-gray-300 px-6 py-3 rounded-xs text-md font-semibold hover:bg-gray-600 transition-all duration-200 shadow-sm"
            >
              View Map →
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full">
          <img
            src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
            alt="Smart City Platform"
            className="rounded-md shadow-2xl w-full"
          />
        </div>
      </div>
    </section>
  );
}
