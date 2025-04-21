import React from "react";
import { useNavigate } from "react-router-dom";

function MovieCard({
  movieObj,
  handleWatchlist,
  watchlist,
  handleRemoveFromWatchlist,
}) {
  const navigate = useNavigate();

  function doesContain() {
    for (let i = 0; i < watchlist.length; i++) {
      if (watchlist[i].id === movieObj.id) {
        return true;
      }
    }
    return false;
  }

  function handleClick() {
    navigate(`/info/${movieObj.id}`);
  }


  function handleWatchlistClick(e, action) {
    e.stopPropagation();
    action();
  }

  return (
    <div
      className="relative h-[400px] w-full bg-cover bg-center rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group"
      style={{
        backgroundImage: movieObj.poster_path
          ? `url(https://image.tmdb.org/t/p/w500/${movieObj.poster_path})`
          : "linear-gradient(to bottom, #3490dc, #6574cd)",
      }}
      onClick={handleClick}
    >
      {/* Add a subtle overlay on hover */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

      {/* Watchlist heart icon */}
      {doesContain() ? (
        <div
          className="absolute top-3 right-3 p-2 rounded-full bg-sky-900/80 hover:bg-sky-900 shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer"
          onClick={(e) => handleWatchlistClick(e, () => handleRemoveFromWatchlist(movieObj))}
        >
          <span className="text-xl">❤️</span>
        </div>
      ) : (
        <div
          className="absolute top-3 right-3 p-2 rounded-full bg-sky-900/80 hover:bg-sky-900 shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer"
          onClick={(e) => handleWatchlistClick(e, () => handleWatchlist(movieObj))}
        >
          <span className="text-xl">🤍</span>
        </div>
      )}

    {/* Rating badge */}
    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gray-900/80 text-white font-medium shadow-lg flex items-center gap-1">
  {movieObj.vote_average > 0 ? (
    <>
      <span className="text-yellow-400">⭐</span>
      <span>{movieObj.vote_average.toFixed(1)}</span>
    </>
  ) : !movieObj.release_date || new Date(movieObj.release_date) > new Date() ? (
    <span className="text-blue-400">Upcoming</span>
  ) : (
    <span className="text-gray-400">No Rating</span>
  )}
</div>


      {/* Movie info container at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent pt-8 pb-4 px-3">
        <h3 className="text-white font-medium text-center text-base sm:text-lg line-clamp-2 mb-1">
          {movieObj.title}
        </h3>
        <p className="text-gray-300 text-xs text-center opacity-80">
          {movieObj.release_date ? new Date(movieObj.release_date).getFullYear() : ""}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;