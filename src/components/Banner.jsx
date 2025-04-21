import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

function Banner({ searchTerm, setSearchTerm, searchRef }) {
  const [movieObj, setMovieObj] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevMovieObj, setPrevMovieObj] = useState(null);
  const isInitialLoad = useRef(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const intervalRef = useRef(null);

  function handleSearch(e) {
    if (e.key === 'Enter' && searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Function to preload image before displaying
  const preloadImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => resolve(true);
      img.onerror = () => reject(false);
    });
  };

  const fetchMovie = async () => {
    try {
      const totalPages = 100;
      const randomPage = Math.floor(Math.random() * totalPages) + 1;
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=58df7c40355d1c9e107a0447f2b81e4a&language=en-US&page=${randomPage}`
      );
      
      const movieList = response.data.results.filter(movie => movie.backdrop_path);
      
      if (movieList.length === 0) {
        console.error("No movies with valid backdrop paths");
        return;
      }
      
      const randomIndex = Math.floor(Math.random() * movieList.length);
      const selectedMovie = movieList[randomIndex];
      
      // Make sure the image URL is valid
      if (!selectedMovie.backdrop_path) {
        console.error("Selected movie has no backdrop path");
        return;
      }
      
      const imageUrl = `https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`;
      
      // Preload the image
      try {
        await preloadImage(imageUrl);
        setImageLoaded(true);
        
        if (isInitialLoad.current) {
          setMovieObj(selectedMovie);
          isInitialLoad.current = false;
        } else {
          setIsTransitioning(true);
          setPrevMovieObj(movieObj);
          
          setTimeout(() => {
            setMovieObj(selectedMovie);
            setTimeout(() => setIsTransitioning(false), 300);
          }, 300);
        }
      } catch (error) {
        console.error("Error preloading image:", error);
        // Try another movie if this one fails
        fetchMovie();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsTransitioning(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMovie();
    
    // Setup interval for periodic fetches
    intervalRef.current = setInterval(() => {
      fetchMovie();
    }, 10000);
    
    // Clean up
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);  // Remove movieObj from dependencies to prevent constant re-rendering

  // Background style with fallback
  const getBackgroundStyle = (movie) => {
    if (!movie || !movie.backdrop_path) {
      return { backgroundColor: "#1a1a1a" };
    }
    return {
      backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    };
  };

  return (
    <div className="relative overflow-hidden w-full h-screen max-h-[80vh]">
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 z-10"></div>
      
      {/* Previous movie backdrop for transition */}
      {prevMovieObj && isTransitioning && (
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out opacity-0"
          style={getBackgroundStyle(prevMovieObj)}
        ></div>
      )}

      {/* Current movie backdrop */}
      {movieObj ? (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in ${
            isTransitioning || !imageLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={getBackgroundStyle(movieObj)}
        ></div>
      ) : (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-white text-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
            Loading...
          </div>
        </div>
      )}

      {/* Content container */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end items-center pb-24 px-4">
        {/* Tagline */}
        <div className="text-white text-xl md:text-2xl lg:text-3xl font-bold px-6 py-3 bg-black/50 backdrop-blur-sm rounded-lg mb-8 transform transition-all duration-300 hover:scale-105">
          🎬 Search and Discover Amazing Movies!
        </div>

        {/* Search input */}
        <div className="w-full max-w-lg mb-16 transform transition-all duration-300">
          <input
            type="text"
            placeholder="Search Movies"
            className="w-full h-12 md:h-14 px-4 text-lg text-black bg-white/90 backdrop-blur-sm border-2 border-gray-300 rounded-full shadow-xl outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-300/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
          />
        </div>

        {/* Movie title */}
        {movieObj && (
          <div 
            className={`text-white w-full max-w-lg text-center text-lg md:text-xl p-3 bg-black/60 backdrop-blur-sm rounded-lg transition-all duration-700 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            <h2 className="font-bold">{movieObj.title}</h2>
            <p className="text-sm md:text-base mt-1 text-gray-200">
              {movieObj.release_date ? new Date(movieObj.release_date).getFullYear() : ''}
              {movieObj.vote_average ? ` • Rating: ${movieObj.vote_average.toFixed(1)}/10` : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Banner;