import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function TVInfo() {
  const { id } = useParams();
  const [tvShow, setTvShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similarShows, setSimilarShows] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const playerRef = useRef(null);
  const navigate = useNavigate();

  function handleClick(TvId) {
    navigate(`/tvinfo/${TvId}`);
  }

  useEffect(() => {
    const fetchTVShowData = async () => {
      setLoading(true);
      try {
        // Get main TV show data
        const showRes = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}?api_key=58df7c40355d1c9e107a0447f2b81e4a&language=en-US`
        );

        // Get cast data
        const creditsRes = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/credits?api_key=58df7c40355d1c9e107a0447f2b81e4a&language=en-US`
        );

        // Get reviews
        const reviewsRes = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/reviews?api_key=58df7c40355d1c9e107a0447f2b81e4a&language=en-US`
        );

        // Get similar shows
        const similarRes = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/similar?api_key=58df7c40355d1c9e107a0447f2b81e4a&language=en-US`
        );

        // Get videos (trailers)
        const videosRes = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=58df7c40355d1c9e107a0447f2b81e4a&language=en-US`
        );

        setTvShow(showRes.data);
        setCast(creditsRes.data.cast || []);
        setReviews(reviewsRes.data.results || []);
        setSimilarShows(similarRes.data.results || []);
        setVideos(videosRes.data.results || []);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching TV show data:", error);
        setLoading(false);
      }
    };

    fetchTVShowData();
    window.scrollTo(0, 0);
  }, [id]);

  // Get the official trailer or first available video
  const getTrailer = () => {
    if (!videos || videos.length === 0) return null;

    // First try to find an official trailer
    const officialTrailer = videos.find(
      (video) =>
        video.type.toLowerCase() === "trailer" &&
        video.site.toLowerCase() === "youtube"
    );

    // If no official trailer, get the first YouTube video
    const firstYoutubeVideo = videos.find(
      (video) => video.site.toLowerCase() === "youtube"
    );

    return officialTrailer || firstYoutubeVideo || null;
  };

  const trailer = getTrailer();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!tvShow) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white px-4">
        <div className="bg-gray-800 p-4 md:p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            TV Show not found!
          </h2>
          <p>We couldn't find the TV show you're looking for.</p>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Calculate runtime display
  const runtimeDisplay =
    tvShow.episode_run_time && tvShow.episode_run_time.length > 0
      ? `${tvShow.episode_run_time[0]} min`
      : "N/A";

  return (
    <div className="bg-gray-900 text-white min-h-screen pb-6 md:pb-12">
      {/* Hero Banner with Trailer (side by side on desktop) */}
      <div className="relative bg-gray-900">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col lg:flex-row">
            {/* Left side: Show info */}
            <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
              <div
                className="relative h-64 sm:h-80 md:h-96 bg-cover bg-center rounded-lg overflow-hidden"
                style={{
                  backgroundImage: tvShow.backdrop_path
                    ? `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`
                    : "linear-gradient(to right, #4a5568, #1a202c)",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-end">
                  <div className="p-4 md:p-6 flex items-end w-full">
                    <div className="w-full flex flex-col md:flex-row md:items-end">
                      <div className="w-24 h-36 sm:w-32 sm:h-48 md:w-40 md:h-60 flex-shrink-0 mb-3 md:mb-0 md:mr-6 overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                        {tvShow.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                            alt={tvShow.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-sm">
                            <span>No Poster</span>
                          </div>
                        )}
                      </div>
                      <div className="md:ml-4">
                        <div className="animate-fade-in">
                          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2">
                            {tvShow.name}
                          </h1>
                          {tvShow.tagline && (
                            <p className="text-gray-300 text-sm md:text-lg italic mb-2 md:mb-4">
                              {tvShow.tagline}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center text-xs sm:text-sm mb-2 md:mb-4">
                            <span className="bg-yellow-500 text-black font-bold py-1 px-2 rounded-lg mr-2 md:mr-3">
                              {tvShow.vote_average
                                ? tvShow.vote_average.toFixed(1)
                                : "N/A"}{" "}
                              ★
                            </span>
                            <span className="mr-2 md:mr-3">
                              {formatDate(tvShow.first_air_date)}
                            </span>
                            <span className="mr-2 md:mr-3">
                              {runtimeDisplay}
                            </span>
                            <span className="mr-2 md:mr-3">
                              {tvShow.number_of_seasons} Season
                              {tvShow.number_of_seasons !== 1 ? "s" : ""}
                            </span>
                            <span>{tvShow.status}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-4">
                            {tvShow.genres &&
                              tvShow.genres.map((genre) => (
                                <span
                                  key={genre.id}
                                  className="bg-purple-700 text-xs px-2 py-1 rounded"
                                >
                                  {genre.name}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Trailer video */}
            <div className="w-full lg:w-1/2 lg:pl-4">
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg h-64 sm:h-80 md:h-96">
                {trailer ? (
                  <div className="w-full h-full">
                    <iframe
                      ref={playerRef}
                      src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
                      title={`${tvShow.name} trailer`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <p className="text-gray-400">No trailer available</p>
                  </div>
                )}
              </div>

              {trailer && (
                <div className="text-sm text-gray-400 mt-2 px-2">
                  <span className="font-semibold text-white">
                    {trailer.name}
                  </span>{" "}
                  • {trailer.type}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs - Mobile-friendly scrollable tabs */}
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        <div className="flex overflow-x-auto space-x-2 md:space-x-4 mb-4 md:mb-6 pb-2 no-scrollbar">
          <button
            className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-lg font-semibold rounded-lg flex-shrink-0 transition-all duration-300 ${
              activeTab === "overview"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-lg font-semibold rounded-lg flex-shrink-0 transition-all duration-300 ${
              activeTab === "cast"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("cast")}
          >
            Cast
          </button>
          <button
            className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-lg font-semibold rounded-lg flex-shrink-0 transition-all duration-300 ${
              activeTab === "reviews"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
          <button
            className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-lg font-semibold rounded-lg flex-shrink-0 transition-all duration-300 ${
              activeTab === "videos"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
          <button
            className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-lg font-semibold rounded-lg flex-shrink-0 transition-all duration-300 ${
              activeTab === "similar"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("similar")}
          >
            Similar Shows
          </button>
        </div>

        {/* Tab Content - Better spacing for mobile */}
        <div className="bg-gray-800 rounded-lg p-3 md:p-6 shadow-lg animate-fade-in">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
                  Overview
                </h2>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {tvShow.overview || "No overview available."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                    Details
                  </h3>
                  <ul className="space-y-1 md:space-y-2 text-sm md:text-base">
                    <li className="flex flex-wrap md:flex-nowrap">
                      <span className="font-medium text-gray-400 w-full md:w-32">
                        Network:
                      </span>
                      <span>
                        {tvShow.networks && tvShow.networks.length > 0
                          ? tvShow.networks.map((n) => n.name).join(", ")
                          : "N/A"}
                      </span>
                    </li>
                    <li className="flex flex-wrap md:flex-nowrap">
                      <span className="font-medium text-gray-400 w-full md:w-32">
                        Type:
                      </span>
                      <span>{tvShow.type || "N/A"}</span>
                    </li>
                    <li className="flex flex-wrap md:flex-nowrap">
                      <span className="font-medium text-gray-400 w-full md:w-32">
                        Original Language:
                      </span>
                      <span>
                      {new Intl.DisplayNames(["en"], { type: "language" }).of(
                  tvShow.original_language
                )}
                      </span>
                    </li>
                    <li className="flex flex-wrap md:flex-nowrap">
                      <span className="font-medium text-gray-400 w-full md:w-32">
                        Popularity:
                      </span>
                      <span>{tvShow.popularity?.toFixed(1) || "N/A"}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                    Production
                  </h3>
                  <ul className="space-y-1 md:space-y-2 text-sm md:text-base">
                    <li className="flex flex-wrap md:flex-nowrap">
                      <span className="font-medium text-gray-400 w-full md:w-32">
                        Created by:
                      </span>
                      <span>
                        {tvShow.created_by && tvShow.created_by.length > 0
                          ? tvShow.created_by
                              .map((creator) => creator.name)
                              .join(", ")
                          : "N/A"}
                      </span>
                    </li>
                    <li className="flex flex-wrap md:flex-nowrap">
                      <span className="font-medium text-gray-400 w-full md:w-32">
                        Production:
                      </span>
                      <span>
                        {tvShow.production_companies &&
                        tvShow.production_companies.length > 0
                          ? tvShow.production_companies
                              .map((company) => company.name)
                              .join(", ")
                          : "N/A"}
                      </span>
                    </li>
                    <li className="flex flex-wrap md:flex-nowrap">
                      <span className="font-medium text-gray-400 w-full md:w-32">
                        Country:
                      </span>
                      <span>
                        {tvShow.origin_country &&
                        tvShow.origin_country.length > 0
                          ?  new Intl.DisplayNames(["en"], { type: "region" }).of(tvShow.origin_country[0])
                          : "N/A"}
                      </span>
                    </li>
                    <li className="flex flex-wrap md:flex-nowrap">
                      <span className="font-medium text-gray-400 w-full md:w-32">
                        Last Air Date:
                      </span>
                      <span>{formatDate(tvShow.last_air_date)}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {tvShow.seasons && tvShow.seasons.length > 0 && (
                <div className="mt-4 md:mt-8">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                    Seasons
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                    {tvShow.seasons.map((season) => (
                      <div
                        key={season.id}
                        className="bg-gray-700 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      >
                        <div className="aspect-w-2 aspect-h-3 w-full">
                          {season.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                              alt={season.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-600 flex items-center justify-center p-2 md:p-4 text-center text-xs md:text-sm">
                              <span>{season.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <h4 className="font-medium text-xs md:text-sm truncate">
                            {season.name}
                          </h4>
                          <p className="text-xs text-gray-400">
                            {season.episode_count} episodes
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cast Tab */}
          {activeTab === "cast" && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
                Cast
              </h2>
              {cast.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                  {cast.slice(0, 15).map((actor) => (
                    <div
                      key={actor.id}
                      className="bg-gray-700 rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
                    >
                      <div className="aspect-w-2 aspect-h-3">
                        {actor.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                            <span className="text-xl md:text-2xl">👤</span>
                          </div>
                        )}
                      </div>
                      <div className="p-2 md:p-3">
                        <h3 className="font-medium text-xs md:text-sm">
                          {actor.name}
                        </h3>
                        <p className="text-xs text-gray-400 truncate">
                          {actor.character}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm md:text-base">
                  No cast information available.
                </p>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
                Reviews
              </h2>
              {reviews.length > 0 ? (
                <div className="space-y-3 md:space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-700 p-3 md:p-4 rounded-lg shadow transform transition duration-300 hover:shadow-lg"
                    >
                      <div className="flex items-center mb-1 md:mb-2">
                        <div className="font-bold text-sm md:text-base mr-2">
                          {review.author}
                        </div>
                        {review.author_details &&
                          review.author_details.rating && (
                            <div className="bg-yellow-500 text-black text-xs px-1 py-0.5 md:px-2 md:py-1 rounded">
                              {review.author_details.rating}/10
                            </div>
                          )}
                      </div>
                      <div className="text-gray-300 text-xs md:text-sm max-h-32 md:max-h-40 overflow-y-auto">
                        {review.content.length > 300
                          ? `${review.content.substring(0, 300)}...`
                          : review.content}
                      </div>
                      <div className="mt-1 md:mt-2 text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm md:text-base">
                  No reviews available for this show.
                </p>
              )}
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === "videos" && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
                Videos
              </h2>
              {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos
                    .filter((video) => video.site.toLowerCase() === "youtube")
                    .map((video) => (
                      <div
                        key={video.id}
                        className="bg-gray-700 rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
                      >
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe
                            src={`https://www.youtube.com/embed/${video.key}`}
                            title={video.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                        <div className="p-2 md:p-3">
                          <h3 className="font-medium text-xs md:text-sm">
                            {video.name}
                          </h3>
                          <p className="text-xs text-gray-400">{video.type}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm md:text-base">
                  No videos available for this show.
                </p>
              )}
            </div>
          )}

          {/* Similar Shows Tab */}
          {activeTab === "similar" && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
                Similar Shows
              </h2>
              {similarShows.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                  {similarShows.slice(0, 12).map((show) => (
                    <div
                      key={show.id}
                      className="bg-gray-700 rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl hover:cursor-pointer"
                      onClick={() => {
                        handleClick(show.id);
                      }}
                    >
                      <div className="aspect-w-2 aspect-h-3">
                        {show.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                            alt={show.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-600 flex items-center justify-center p-1 md:p-2 text-center text-xs">
                            <span>{show.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-xs md:text-sm truncate">
                          {show.name}
                        </h3>
                        <div className="flex items-center text-xs text-gray-400">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span>
                            {show.vote_average
                              ? show.vote_average.toFixed(1)
                              : "N/A"}
                          </span>
                          <span className="ml-auto">
                            {show.first_air_date?.substring(0, 4) || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm md:text-base">No similar shows found.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-hidden: hidden; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}

export default TVInfo;
