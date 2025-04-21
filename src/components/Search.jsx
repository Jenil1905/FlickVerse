import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Search({ searchTerm, setSearchTerm, searchRef }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  
  // Simple no results messages
  const noResultsMessages = [
    "No shows match your search. Try something else!",
    "We couldn't find any shows matching your search.",
    "No results found. Maybe try a different keyword?",
    "Sorry, no TV shows found for your search.",
    "Nothing found. Perhaps check your spelling?"
  ];
  
  // Get random message
  const getRandomMessage = () => {
    return noResultsMessages[Math.floor(Math.random() * noResultsMessages.length)];
  };
  
  function handleClick(TvId){
    navigate(`/tvinfo/${TvId}`);
  }

  // Trigger search if searchTerm exists on mount
  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch();
    }
    // Focus on input when component loads
    searchRef?.current?.focus();
    // eslint-disable-next-line
  }, []);

  // Reset results when searchTerm is cleared
  useEffect(() => {
    if (searchTerm.length === 0) {
      setResults([]);
      setShowResults(false);
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      setError(null);
      setShowResults(true);

      try {
        const url = `https://api.themoviedb.org/3/search/tv?api_key=58df7c40355d1c9e107a0447f2b81e4a&query=${searchTerm}&language=en-US&page=1`;
        const response = await axios.get(url);
        setResults(response.data.results);
      } catch (error) {
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-6">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search TV Shows"
            className="w-full h-14 px-6 pr-14 text-lg text-white bg-gray-900/80 backdrop-blur-sm border-2 border-gray-700 rounded-full shadow-xl outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={handleSearch}
            className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {loading && (
          <div className="flex justify-center my-10 animate-pulse">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animation-delay-200"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animation-delay-400"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-400 p-4 rounded-lg bg-red-900/30 backdrop-blur-sm border border-red-800 animate-fadeIn my-4">
            {error}
          </div>
        )}

        {showResults && !loading && (
            <div className="transition-all duration-500 opacity-100 translate-y-0">
            {results.length > 0 ? (
              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4 text-blue-400">Results</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {results.map((show) => (
                    <div
                      key={show.id}
                      onClick={() => {handleClick(show.id)}}
                      className="cursor-pointer bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-lg transition-all duration-300 hover:shadow-blue-900/30 hover:border-blue-800 hover:bg-gray-800/80 transform hover:-translate-y-1"
                    >
                      <div className="flex">
                        {show.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${show.poster_path}`}
                            alt={show.name}
                            className="w-20 h-auto rounded-md object-cover mr-4"
                          />
                        ) : (
                          <div className="w-20 h-28 bg-gray-700 rounded-md mr-4 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No Image</span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg text-blue-300">{show.name}</h3>
                          {show.first_air_date && (
                            <p className="text-xs text-gray-400 mb-2">
                              {new Date(show.first_air_date).getFullYear()}
                            </p>
                          )}
                          <p className="text-sm text-gray-300 line-clamp-3">
                            {show.overview || 'No description available.'}
                          </p>
                          {show.vote_average > 0 && (
                            <div className="mt-2 flex items-center">
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="ml-1 text-sm text-gray-300">
                                {show.vote_average.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center my-16 animate-fadeIn">
                <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-400 text-lg text-center font-medium">
                  {getRandomMessage()}
                </p>
                <div className="mt-3 text-blue-400">
                  "{searchTerm}"
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;