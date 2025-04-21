import React from 'react';
import tvbanner from '../assets/tvbanner.webp';
import { useNavigate } from 'react-router-dom';

function TvBanner({ searchTerm, setSearchTerm, searchRef }) {
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate('/search'); // Go to the Search page where the actual fetch will happen
    }
  };

  return (
    <div className="relative overflow-hidden w-full h-screen max-h-[80vh]">
      <img 
        src={tvbanner} 
        alt="TV Banner" 
        className="w-full h-full object-cover object-center opacity-80"
      />
      
      {/* Centered content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center px-4 text-center">
        <div className="text-red-300 text-xl md:text-2xl lg:text-3xl font-bold px-6 py-3 bg-black/50 backdrop-blur-sm rounded-lg mb-6 transform transition-all duration-300 hover:scale-105">
          Binge the Best. Know What’s Worth Watching.
        </div>

        <div className="w-full max-w-lg transform transition-all duration-300">
          <input 
            ref={searchRef}
            type="text"
            placeholder="Search Shows"
            className="w-full h-12 md:h-14 px-4 text-lg text-black bg-white/90 backdrop-blur-sm border-2 border-gray-300 rounded-full shadow-xl outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-300/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}

export default TvBanner;
