import React, { useEffect, useState } from "react";
import { genre } from "../utility/genre";
import { useNavigate } from "react-router-dom";

function Watchlist({ watchlist, handleRemoveFromWatchlist }) {
  const [search, setSearch] = useState("");
  const [currGenre, setCurrGenre] = useState("All Genre");
  const [genreList, setGnereList] = useState([]);
  const [isDeleting, setIsDeleting] = useState(null);
  const navigate = useNavigate();

  function deleteWL(e, movieObj) {
    e.stopPropagation();
    setIsDeleting(movieObj.id);
    setTimeout(() => {
      handleRemoveFromWatchlist(movieObj);
      setIsDeleting(null);
    }, 300);
  }

  function handleGenre(newGenre) {
    setCurrGenre(newGenre);
  }

  useEffect(() => {
    let temp = watchlist.map((movieObj) => {
      return genre[movieObj.genre_ids[0]];
    });
    const genreWithoutDup = new Set(temp);
    setGnereList(["All Genre", ...genreWithoutDup]);
  }, [watchlist]);

  const filteredMovies = watchlist
    .filter((movieObj) => {
      if (currGenre === "All Genre") {
        return true;
      } else {
        return currGenre === genre[movieObj.genre_ids[0]];
      }
    })
    .filter((movieObj) => {
      return movieObj.title.toLowerCase().includes(search.toLowerCase());
    });

  return (
    <div className="px-4 md:px-8 lg:px-12 py-6 bg-gray-50 min-h-screen">
      {/* Genre Filter */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4">
        {genreList.map((genreItem, index) => (
          <button
            key={index}
            onClick={() => handleGenre(genreItem)}
            className={`px-4 py-2 text-sm md:text-base rounded-lg font-medium transition-all duration-300 hover:cursor-pointer transform hover:scale-105 ${
              currGenre === genreItem
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {genreItem}
          </button>
        ))}
      </div>
      {/* Toggle WatchList */}
     {currGenre==="All Genre" ?(
       <div>
       <button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 hover:cursor-pointer">
         TV Show
       </button>
     </div> 
     ):(<></>)
     }

      {/* Search Box */}
      <div className="flex justify-center my-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search Movies"
            className="w-full border border-gray-300 rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all duration-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute right-4 top-3 text-gray-400">
            {search ? "×" : "🔍"}
          </span>
        </div>
      </div>

      {/* Movies Table/Cards */}
      {filteredMovies.length > 0 ? (
        <div>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-4 px-6 text-left">Name</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6">Popularity</th>
                  <th className="py-4 px-6">Genre</th>
                  <th className="py-4 px-6">Remove</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.map((movieObj) => (
                  <tr
                    key={movieObj.id}
                    className={`border-b hover:cursor-pointer border-gray-200 bg-white hover:bg-blue-50 transition-all duration-300 ${
                      isDeleting === movieObj.id
                        ? "opacity-0 transform translate-x-full"
                        : ""
                    }`}
                    onClick={() => navigate(`/info/${movieObj.id}`)}
                  >
                    <td className="flex items-center py-4 px-6">
                      <img
                        className="h-16 w-auto rounded shadow object-cover"
                        src={`https://image.tmdb.org/t/p/original/${movieObj.poster_path}`}
                        alt={movieObj.title}
                      />
                      <div className="ml-4 font-medium">{movieObj.title}</div>
                    </td>
                    <td className="py-4 px-6">
                      {movieObj.vote_average > 0 ? (
                        <span
                          className={`px-2 py-1 rounded ${
                            movieObj.vote_average >= 7
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {movieObj.vote_average.toFixed(1)}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">
                          Upcoming
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {movieObj.popularity.toFixed(1)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-800">
                        {genre[movieObj.genre_ids[0]]}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={(e) => deleteWL(e, movieObj)}
                        className="text-red-500 hover:text-red-700 hover:cursor-pointer hover:bg-red-100 px-3 py-1 rounded transition-colors duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredMovies.map((movieObj) => (
              <div
                key={movieObj.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                  isDeleting === movieObj.id
                    ? "opacity-0 transform translate-x-full"
                    : ""
                }`}
                onClick={() => navigate(`/info/${movieObj.id}`)}
              >
                <div className="flex">
                  <img
                    className="h-32 w-24 object-cover"
                    src={`https://image.tmdb.org/t/p/original/${movieObj.poster_path}`}
                    alt={movieObj.title}
                  />
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-lg mb-1">{movieObj.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <span>Rating: </span>
                      <span
                        className={`ml-1 px-2 py-0.5 rounded text-xs ${
                          movieObj.vote_average >= 7
                            ? "bg-green-100 text-green-800"
                            : movieObj.vote_average > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {movieObj.vote_average > 0
                          ? movieObj.vote_average.toFixed(1)
                          : "Upcoming"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      Popularity: {movieObj.popularity.toFixed(1)}
                    </div>
                    <div className="text-sm mb-2">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs">
                        {genre[movieObj.genre_ids[0]]}
                      </span>
                    </div>
                    <button
                      onClick={(e) => deleteWL(e, movieObj)}
                      className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-6xl mb-4">🍿</div>
          <h2 className="text-xl text-gray-600 mb-2">
            Your watchlist is empty
          </h2>
          <p className="text-gray-500">
            Add some movies to your watchlist to see them here.
          </p>
        </div>
      )}
    </div>
  );
}

export default Watchlist;
