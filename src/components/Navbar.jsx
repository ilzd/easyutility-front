import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300">
          CS Lineups
        </Link>
        <div className="flex gap-4">
          <Link to="/" className="text-white hover:text-gray-300">
            Search
          </Link>
          <Link to="/create" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">
            Create Lineup
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
