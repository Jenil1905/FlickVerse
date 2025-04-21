import axios from "axios";
import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import Page from "./Page";

function Movies({ handleAddtoWatchlist, watchlist, handleRemoveFromWatchlist, searchTerm, searchRef }) {
  const [movies, setMovies] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isLoadingNewPage, setIsLoadingNewPage] = useState(false);

  function nextPage() {
    setIsLoadingNewPage(true);
    setPageNo(pageNo + 1);
    window.scrollTo({ top: searchRef.current.offsetTop, behavior: 'smooth' });
  }

  function prevPage() {
    if (pageNo > 1) {
      setIsLoadingNewPage(true);
      setPageNo(pageNo - 1);
      window.scrollTo({ top: searchRef.current.offsetTop, behavior: 'smooth' });
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    setLoading(true);
    const fetchTimeout = setTimeout(() => {
      if (searchTerm.length > 2) {
        axios
          .get(
            `https://api.themoviedb.org/3/search/movie?api_key=58df7c40355d1c9e107a0447f2b81e4a&query=${searchTerm}&language=en-US&page=1`,
            { signal }
          )
          .then((response) => {
            setMovies(response.data.results);
            setLoading(false);
            setIsLoadingNewPage(false);
          })
          .catch((error) => {
            if (!axios.isCancel(error)) {
              console.log(error);
              setLoading(false);
              setIsLoadingNewPage(false);
            }
          });
      } else {
        axios
          .get(
            `https://api.themoviedb.org/3/movie/popular?api_key=58df7c40355d1c9e107a0447f2b81e4a&language=en-US&page=${pageNo}`,
            { signal }
          )
          .then((response) => {
            setMovies(response.data.results);
            setLoading(false);
            setIsLoadingNewPage(false);
          })
          .catch((error) => {
            if (!axios.isCancel(error)) {
              console.log(error);
              setLoading(false);
              setIsLoadingNewPage(false);
            }
          });
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(fetchTimeout);
    };
  }, [searchTerm, pageNo]);

  return (
    <div ref={searchRef} className="container mx-auto px-4 py-8 min-h-screen bg-black">
      <div className="relative overflow-hidden mb-12">
        <h1
          className={`text-2xl md:text-3xl lg:text-4xl text-white font-bold text-center my-6 pb-2 border-b-2 border-gray-200 transform transition-all duration-500 ${
            isLoadingNewPage ? "translate-y-8 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          {searchTerm.length > 0 ? `Search Results for "${searchTerm}"` : "Browse Movies"}
        </h1>
        
        
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-gray-600 animate-pulse">Loading amazing movies...</p>
        </div>
      ) : (
        <>
          {movies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movieObj, index) => {
                return (
                  <div
                    key={movieObj.id}
                    className="transform transition-all duration-500"
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      opacity: isLoadingNewPage ? 0 : 1,
                      transform: isLoadingNewPage ? 'translateY(20px)' : 'translateY(0)'
                    }}
                  >
                    <MovieCard
                      movieObj={movieObj}
                      handleWatchlist={handleAddtoWatchlist}
                      watchlist={watchlist}
                      handleRemoveFromWatchlist={handleRemoveFromWatchlist}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <svg className="w-24 h-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div className="text-2xl md:text-3xl text-gray-800 font-bold mb-4 animate-fadeIn">No movies found</div>
              <p className="text-gray-600 animate-fadeIn delay-100">Try a different search term or browse trending movies</p>
            </div>
          )}
        </>
      )}

      {!searchTerm.length && (
        <div className="mt-12 transition-all duration-300 transform">
          <Page pageNumber={pageNo} nextPageFN={nextPage} prevPageFn={prevPage} />
        </div>
      )}
    </div>
  );
}

export default Movies;