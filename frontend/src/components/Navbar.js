import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
          Daily Journal
        </Link>
        <div className="space-x-4">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-gray-900 transition duration-300"
          >
            New Entry
          </Link>
          <Link 
            to="/calendar" 
            className="text-gray-600 hover:text-gray-900 transition duration-300"
          >
            Calendar
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
