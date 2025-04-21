import React from "react";
import { Link } from 'react-router-dom';

function NavBar() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-gray-900 shadow-lg w-full">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop and Mobile navbar header */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div to="/" className="text-blue-400 text-2xl font-bold">
            FlickVerse🎥
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-200 hover:text-blue-400 font-medium">
              Movies
            </Link>
            <Link to="/watchlist" className="text-gray-200 hover:text-blue-400 font-medium">
              Watchlist
            </Link>
            <Link to="/tv" className="text-gray-200 hover:text-blue-400 font-medium">
              TV Shows
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-200 text-3xl font-bold focus:outline-none"
            onClick={toggleMenu}
          >
            {menuOpen ? 'x' : '☰'}
          </button>
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-gray-200 hover:text-blue-400 font-medium py-2"
                onClick={() => setMenuOpen(false)}
              >
                Movies
              </Link>
              <Link 
                to="/watchlist" 
                className="text-gray-200 hover:text-blue-400 font-medium py-2"
                onClick={() => setMenuOpen(false)}
              >
                Watchlist
              </Link>
              <Link 
                to="/tv" 
                className="text-gray-200 hover:text-blue-400 font-medium py-2"
                onClick={() => setMenuOpen(false)}
              >
                TV Shows
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;