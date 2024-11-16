import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600 font-medium' : 'text-gray-600';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
          Daily Journal
        </Link>
        <div className="space-x-6">
          <Link 
            to="/" 
            className={`${isActive('/')} hover:text-gray-900 transition duration-300`}
          >
            New Entry
          </Link>
          <Link 
            to="/entries" 
            className={`${isActive('/entries')} hover:text-gray-900 transition duration-300`}
          >
            Past Entries
          </Link>
          <Link 
            to="/calendar" 
            className={`${isActive('/calendar')} hover:text-gray-900 transition duration-300`}
          >
            Calendar
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
