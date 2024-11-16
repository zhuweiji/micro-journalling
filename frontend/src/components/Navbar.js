import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600 font-medium' : 'text-gray-600';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-2">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-gray-800 hover:text-gray-600 whitespace-nowrap">
            Daily Journal
          </Link>
          <div className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base">
            <Link 
              to="/" 
              className={`${isActive('/')} hover:text-gray-900 transition duration-300 whitespace-nowrap`}
            >
              New Entry
            </Link>
            <Link 
              to="/entries" 
              className={`${isActive('/entries')} hover:text-gray-900 transition duration-300 whitespace-nowrap`}
            >
              Past Entries
            </Link>
            <Link 
              to="/calendar" 
              className={`${isActive('/calendar')} hover:text-gray-900 transition duration-300 whitespace-nowrap`}
            >
              Calendar
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
