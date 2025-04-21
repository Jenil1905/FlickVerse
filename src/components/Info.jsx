import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Info() {
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const usdToinr = 83;
  const [trailerKey, setTrailerKey] = useState(null);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState("");
  const [writer, setWriter] = useState("");
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const navigate = useNavigate();
  const [trailerWindow, setTrailerWindow] = useState(false);
  const castScrollRef = useRef(null);

  const handleMovieClick = (movieId) => {
    setLoading(true);
    navigate(`/info/${movieId}`);
    window.scrollTo(0, 0);
  };

  function handleWatchTrailer() {
    if (trailerKey) {
      setTrailerWindow(true);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      alert("Trailer not available!");
    }
  }

  function handleWatchMovie() {
    if (movieData && movieData.title) {
      try {
        // Format the movie title for the URL (lowercase, hyphens instead of spaces)
        const formattedTitle = movieData.title
          .toLowerCase()
          .replace(/[^\w\s]/g, "") // Remove special characters
          .replace(/\s+/g, "-"); // Replace spaces with hyphens
        
        const movieUrl = `https://attackertv.so/search/${formattedTitle}`;
        
        // Open in a new tab
        window.open(movieUrl, "_blank");
      } catch (error) {
        console.error("Error opening movie page:", error);
        alert("Error accessing the movie. Please try again later.");
      }
    } else {
      alert("Movie not found on AttackerTV!");
    }
  }

  function closeTrailer() {
    setTrailerWindow(false);
    document.body.style.overflow = ""; // Restore scrolling
  }

  const scrollCast = (direction) => {
    if (castScrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      castScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    setTrailerKey(null);
    const fetchData = async () => {
      try {
        // Fetch main movie data
        const movieRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=58df7c40355d1c9e107a0447f2b81e4a&language=en-US`
        );
        setMovieData(movieRes.data);

        // Fetch trailer data
        const trailerRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=58df7c40355d1c9e107a0447f2b81e4a&language=en-US`
        );
        const trailer = trailerRes.data.results;
        const officialTrailer = trailer.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (officialTrailer) {
          setTrailerKey(officialTrailer.key);
        }

        // Fetch credits
        const creditsRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=58df7c40355d1c9e107a0447f2b81e4a&language=en-US`
        );
        setCast(creditsRes.data.cast);
        const dir = creditsRes.data.crew.find(
          (person) => person.job === "Director"
        );
        if (dir) setDirector(dir.name);
        const wri = creditsRes.data.crew.find((person) =>
          ["Writer", "Screenplay", "Author"].includes(person.job)
        );
        if (wri) setWriter(wri.name);

        // Fetch reviews
        const reviewsRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=58df7c40355d1c9e107a0447f2b81e4a&language=en-US&page=1`
        );
        setReviews(reviewsRes.data.results);

        // Fetch similar movies
        const similarRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=58df7c40355d1c9e107a0447f2b81e4a&language=en-US&page=1`
        );
        setSimilar(similarRes.data.results);

        // Finish loading
        setTimeout(() => setLoading(false), 500);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-100 to-blue-100">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-800">
            Loading movie details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-100 pb-12 animate-fadeIn">
      {/* Trailer Modal */}
      {trailerWindow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 animate-fadeIn">
          <div className="relative w-full max-w-4xl mx-4 aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Movie Trailer"
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <button
              onClick={closeTrailer}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black bg-opacity-60 text-white hover:bg-opacity-80 transition-all"
              aria-label="Close trailer"
            >
              <svg
                className="w-6 h-6 hover:cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative w-full h-[50vh] sm:h-[45vh] md:h-[50vh] lg:h-[60vh] bg-gray-800 mb-8 overflow-hidden">
        {movieData && movieData.backdrop_path && (
          <div
            className="absolute inset-0 bg-cover bg-center animate-scaleUp"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${movieData.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </div>
        )}

        <div className="absolute inset-0 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start px-4 py-6 md:p-8 lg:p-12">
          {/* Poster */}
          <div className="relative w-40 sm:w-48 md:w-64 lg:w-72 aspect-[2/3] rounded-xl shadow-2xl overflow-hidden flex-shrink-0 transform transition-all duration-500 hover:scale-105 mb-4 md:mb-0">
            {movieData && movieData.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500/${movieData.poster_path}`}
                alt={movieData.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white">
                No Poster
              </div>
            )}
          </div>

          
          {/* Movie Details */}
          {movieData && (
            <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 text-white md:ml-8 max-w-lg md:max-w-2xl animate-slideUp text-center md:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                {movieData.title}
              </h1>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center md:justify-start">
                <span className="bg-yellow-500 text-black font-bold px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
                  <span>⭐</span>
                  <span>{movieData.vote_average.toFixed(1)}</span>
                </span>

                {movieData.release_date && (
                  <span className="text-gray-300">
                    {movieData.release_date.split("-")[0]}
                  </span>
                )}

                {movieData.runtime > 0 && (
                  <span className="text-gray-300">
                    {`${Math.floor(movieData.runtime / 60)}h ${
                      movieData.runtime % 60
                    }min`}
                  </span>
                )}

                {movieData.adult && (
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-sm">
                    18+
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm md:text-base text-gray-200 line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
                {movieData.overview}
              </p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start ">
                {movieData.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre.id}
                    className="px-2 sm:px-3 py-1 bg-blue-600 bg-opacity-40 rounded-full text-xs sm:text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Updated buttons section with functional Watch Movie button */}
              <div className="flex gap-2 sm:gap-3 mt-1 sm:mt-2 justify-center md:justify-start sticky bottom-0 z-20">
                <button
                  className="px-3 sm:px-6 py-1 sm:py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                  onClick={() =>
                    window.open(
                      `https://www.imdb.com/title/${movieData.imdb_id}`,
                      "_blank"
                    )
                  }
                >
                  <span className="hover:cursor-pointer">IMDb</span>
                </button>

                <button
                  className="px-3 sm:px-6 py-1 sm:py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                  onClick={handleWatchTrailer}
                >
                  <span className="hover:cursor-pointer">🎬 Watch Trailer</span>
                </button>
                <button
                  className="px-3 sm:px-6 py-1 sm:py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                  onClick={handleWatchMovie}
                >
                  <span className="hover:cursor-pointer">📽️ Watch Movie</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Movie Details */}
      <div className="container mx-auto px-4">
        {movieData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white rounded-xl shadow-lg p-6 mb-8 animate-fadeIn">
            <div className="flex flex-col">
              <h3 className="text-gray-500 mb-1">Original Language</h3>
              <p className="text-lg font-medium">
                {new Intl.DisplayNames(["en"], { type: "language" }).of(
                  movieData.original_language
                )}
              </p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-gray-500 mb-1">Release Date</h3>
              <p className="text-lg font-medium">{movieData.release_date}</p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-gray-500 mb-1">Run Time</h3>
              <p className="text-lg font-medium">
                {movieData.runtime > 0
                  ? `${Math.floor(movieData.runtime / 60)}h ${
                      movieData.runtime % 60
                    }min`
                  : "No Data Available"}
              </p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-gray-500 mb-1">Budget</h3>
              <p className="text-lg font-medium">
                {movieData.budget > 0
                  ? `₹${(movieData.budget * usdToinr).toLocaleString("en-IN")}`
                  : "No Data Available"}
              </p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-gray-500 mb-1">Revenue</h3>
              <p className="text-lg font-medium">
                {movieData.revenue > 0
                  ? `₹${(movieData.revenue * usdToinr).toLocaleString("en-IN")}`
                  : "No Data Available"}
              </p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-gray-500 mb-1">Director</h3>
              <p className="text-lg font-medium text-blue-600">
                {director || "Unknown"}
              </p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-gray-500 mb-1">Writer</h3>
              <p className="text-lg font-medium text-blue-600">
                {writer || "Unknown"}
              </p>
            </div>
          </div>
        )}

        {/* Cast Section */}
        <section className="mb-12 animate-slideUp">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
            <span className="block w-1 h-8 bg-blue-600 mr-3"></span>
            Top Cast
          </h2>

          <div className="relative">
            {/* Left scroll button */}
            {cast.length > 3 && (
              <button
                onClick={() => scrollCast("left")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white bg-opacity-80 rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-100 focus:outline-none"
                aria-label="Scroll left"
              >
                <svg
                  className="w-6 h-6 text-gray-800 hover:cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Cast scrollable area */}
            <div
              ref={castScrollRef}
              className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide px-4"
              style={{ scrollBehavior: "smooth" }}
            >
              {cast.map((member) => (
                <div
                  key={member.id}
                  className="flex-shrink-0 w-64 bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={
                        member.profile_path
                          ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                          : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAACUCAMAAADmiEg1AAAAMFBMVEXk5ueutLfg4uSnrrHn6eqqsbSxt7rS1dfW2dva3d7Hy82/xMa7wMPKztDq7O3CxskpgEGPAAAETElEQVR4nO2c25KkIAxAuQQExOb//3bRvk1v28olEqzyPM1O1VadoWKIkMjYxcXFxcXFxcXFxcUFHQDUBlkAE8KayYUQ3DQZK8QJ/gAAMTivlVQPJNfeDZ2rw80ErZXiH8R/+9H0aw5gNP+JNn2KAzNa/tbmXGpD7bgCWK+2rOd4kcF2t+aT3tOezfXQmfi4L33H36hV/yBSFvu55ILa9oVNlV7QvQT5VvZbXfE+xG2e9iJO7RwRmdYL1NKR5CfyL57amo1F3jzQWsNUZB1jfCDVzn4m31B6s92a5PeCE26cMGwWgNtIuroWyq05YU6BqThKFshqwyrrGOE0FVZxDqRe8PJk8ljwkcIaTO1yc04SKJVP5bzgE4G28PXrrQkC3FbsOU9ke21Ws1e+vNtnFKjNJgtj8yIFMLS5bl9cIYQJJ8iEBse7dVFYW1M9af1g3gKOt2vtjbDrzIzn9FbNvctfiD+8/Tm9+eXd1Lt9nCDlk+beyRcj27TOJ+Bw9p2ptfdwzn3+rHXVaevYurPBJ+3fG6DwouEDFdq/75z0vZhZhPWmOIeoPh7k7XfLhfo3NUlxObXZ3JMIzQF49TkyzSXmac/toS5QaI7tWX1tRXYvVbfgJEnw7l1TFErK7pnyIoWiNHlT3FegNKH1/GiWrjdpH0cULzzfdLTahTlF0fcpMZbe8/jSprj/+8LmiistevDObVbqpe8xs4Wwk9VegIxQ8V0NDITExW5+obOHSetb727IAUSQO+ZKun5C+83OhINSvkdrtszB+K/hnae0HnvJfitEc+f5//GiJPfOdpVGvgAQZhi1ko9BLymlHgfb+ZzXGzFMk1vG6qhNMoCFW+T+E7XPHoujEMJaY4Y7xtiIYL3qx+UFYQcXRu+91vNQ4ML8o/Z+DG4wgt36ko/OdhpnQz67rqXB+ZfxD3BGxOCh9mXzFGDc4p2Xe3vl6w+IOXEQ9/9HJx1DY/rO1/vu87qTqQNb22RS3X2gGd69senXpp6ornUwjWN9rkQw7ouVbnmMAmLYnsjNQGpn20R6tPZlQb2OiubHiwNMviaq182DPfiQE+MyahV3aLBYjxXX/6P4cJQ5MMeRI+TD3B8T5kipb0NcTwcsORy62A9z9DdnyJg0rxFHbpAAi537foF7xFJ9M5wO4tQaJB7+IYljHTPjTI7kmOOIt9aO4ginn6K9Nsq3aSi068+bUbrtisyrsgqEo+qoQ8WxhnSKKL+aPazYTqP4KrxNTfKbws9GlbYMoFEW4lUfUcDxLutkIrbmZW2/WAMMVeR/Mwryvu10ECr/dpn6obyTW9MSp+4XKjeJ9xDdM5kRXvRRqiPIaxEnLUw+yWrFquw0xiSrHRXj2w9IqIxPGnQUJjznQ1dYw6w4pL+ydZNNFpL3zPJm3SNIH1UHR+36QfLBG9lL/DrpNQrSzDMSyWcpFR/nO4TEt4dYesuuSJ6dFp2xovgPOvI9e4LYmyIAAAAASUVORK5CYII="
                      }
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-110 transition-all duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600">{member.character}</p>
                  </div>
                </div>
              ))}
              {cast.length === 0 && (
                <div className="w-full text-center py-12 text-gray-500">
                  No cast information available
                </div>
              )}
            </div>

            {/* Right scroll button */}
            {cast.length > 3 && (
              <button
                onClick={() => scrollCast("right")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white bg-opacity-80 rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-100 focus:outline-none"
                aria-label="Scroll right"
              >
                <svg
                  className="w-6 h-6 text-gray-800 hover:cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mb-12 animate-slideUp delay-150">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
            <span className="block w-1 h-8 bg-blue-600 mr-3"></span>
            Top Reviews
          </h2>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <p className="text-xl font-bold text-gray-700">
                No reviews available
              </p>
              <p className="text-gray-500 mt-2">
                Be the first to review this movie!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((review, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-102 hover:shadow-xl"
                >
                  <div className="bg-blue-600 px-4 py-3 text-white">
                    <div className="font-bold">{review.author}</div>
                    <div className="text-xs opacity-80">
                      {review.created_at
                        ? new Date(review.created_at).toLocaleDateString()
                        : ""}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700 line-clamp-4">
                      {review.content}
                    </p>
                    <button className="mt-4 text-blue-600 text-sm font-medium hover:underline">
                      Read more
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Similar Movies Section */}
        <section className="animate-slideUp delay-300">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
            <span className="block w-1 h-8 bg-blue-600 mr-3"></span>
            More Like This
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {similar.slice(0, 12).map((movie) => (
              <div
                key={movie.id}
                className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                onClick={() => handleMovieClick(movie.id)}
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-white text-center p-2">
                      {movie.title}
                    </span>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent pt-8 pb-4 px-2">
                  <h3 className="text-white text-sm font-medium text-center line-clamp-2">
                    {movie.title}
                  </h3>
                </div>
              </div>
            ))}
            {similar.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No similar movies found
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Add global animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scaleUp {
          from {
            transform: scale(1.1);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

       .delay-150 {
          animation-delay: 150ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .animate-scaleUp {
          animation: scaleUp 10s ease-out forwards;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 640px) {
          .aspect-video {
            aspect-ratio: 16/9;
          }
        }
      `}</style>
    </div>
  );
}

export default Info;