import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Tv() {
  const [tv, setTv] = useState([]);
  const [hindi, setHindi] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [country, setCountry] = useState("IN"); 
  const navigate = useNavigate()

  function handleClick(TVid){
    navigate(`/tvinfo/${TVid}`)
  }

  useEffect(() => {
    const fetchRandomTV = () => {
      const totalPages = 100;
      const randomPage = Math.floor(Math.random() * totalPages) + 1;

      axios
        .get(`https://api.themoviedb.org/3/trending/tv/day`, {
          params: {
            api_key: "58df7c40355d1c9e107a0447f2b81e4a",
            page: randomPage,
            language: "en-US",
          },
        })
        .then((res) => setTv(res.data.results))
        .catch((err) => console.log(err));
    };

    fetchRandomTV();
  }, []);

  useEffect(() => {
    const fetchHindiTV = () => {
      const totalPages = 60;
      const randomPage = Math.floor(Math.random() * totalPages) + 1;

      axios
        .get("https://api.themoviedb.org/3/discover/tv", {
          params: {
            api_key: "58df7c40355d1c9e107a0447f2b81e4a",
            with_original_language: "hi",
            sort_by: "popularity.desc",
            page: randomPage,
          },
        })
        .then((res) => {
          setHindi(res.data.results);
          console.log("Fetched Hindi shows:", res.data.results);
        })
        .catch((err) => console.log(err));
    };

    fetchHindiTV();
  }, []);

  useEffect(() => {
    const fetchUpcomingTV = () => {
      const totalPages = 10; 
      const randomPage = Math.floor(Math.random() * totalPages) + 1;

      const today = new Date().toISOString().split("T")[0]; 

      axios
        .get("https://api.themoviedb.org/3/discover/tv", {
          params: {
            api_key: "58df7c40355d1c9e107a0447f2b81e4a",
            sort_by: "popularity.desc",
            page: randomPage,
            "first_air_date.gte": today,
          },
        })
        .then((res) => {
          console.log("Fetched Upcoming Shows:", res.data.results);
          setUpcoming(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    fetchUpcomingTV();
  }, []);

  useEffect(() => {
    const fetchTopRatedTV = () => {
      const totalPages = 70;
      const randomPage = Math.floor(Math.random() * totalPages) + 1;
  
      axios
        .get("https://api.themoviedb.org/3/discover/tv", {
          params: {
            api_key: "58df7c40355d1c9e107a0447f2b81e4a",
            sort_by: "vote_average.desc",
            vote_count_gte: 100,
            with_origin_country: country, 
            page: randomPage,
          },
        })
        .then((res) => {
          console.log("Top Rated Shows:", res.data.results);
          setTopRated(res.data.results);
        })
        .catch((err) => console.log(err));
    };
  
    fetchTopRatedTV();
  }, [country]);
  

  return (
    <div className="bg-black min-h-screen px-4 py-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center text-white m-2 mt-8">
        <span className="block w-1 h-8 bg-blue-600 mr-3"></span>
        Trending Shows
      </h2>

      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto gap-4 pb-4 hover:cursor-pointer scrollbar-hide">
        {tv.map((show) => (
          <div
            key={show.id}
            className="min-w-[160px] md:min-w-[200px] relative group"
            onClick={()=>{handleClick(show.id)}}
          >
            {show.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/original/${show.poster_path}`}
                alt={show.name}
                className="w-full h-auto rounded-lg shadow-lg object-cover transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
              />
            ) : (
              <div className="w-full h-64 bg-gray-800 flex items-center justify-center rounded-lg">
                <span className="text-white text-center p-2">{show.name}</span>
              </div>
            )}

            {/* Rating Badge */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gray-900/80 text-white font-medium shadow-lg flex items-center gap-1">
                {show.vote_average > 0 ? (
                  <>
                    <span className="text-yellow-400">⭐</span>
                    <span>{show.vote_average.toFixed(1)}</span>
                  </>
                ) : new Date(show.first_air_date) > new Date() ? (
                  <span className="text-blue-400">Upcoming</span>
                ) : (
                  <span className="text-gray-400">No Rating</span>
                )}
              </div>

            {/* Watchlist Heart Icon */}
            <div className="absolute top-3 right-3 p-2 rounded-full bg-sky-900/80 hover:bg-sky-900 shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer">
              <span className="text-xl">🤍</span>
            </div>

            {/* Title Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent pt-8 pb-4 px-2 rounded-b-lg">
              <h3 className="text-white text-sm font-medium text-center line-clamp-2">
                {show.name}
              </h3>
              <p className="text-gray-300 text-xs text-center opacity-80">
                {show.first_air_date
                  ? new Date(show.first_air_date).getFullYear()
                  : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 m-2">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center text-white m-2 mt-4">
          <span className="block w-1 h-8 bg-blue-600 mr-3"></span>
          Popular Hindi Shows
        </h2>
        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-4 pb-4 hover:cursor-pointer scrollbar-hide">
          {hindi.map((show) => (
            <div
              key={show.id}
              className="min-w-[160px] md:min-w-[200px] relative group"
              onClick={()=>{handleClick(show.id)}}
            >
              {show.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/original/${show.poster_path}`}
                  alt={show.name}
                  className="w-full h-auto rounded-lg shadow-lg object-cover transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
                />
              ) : (
                <div className="w-full h-64 bg-gray-800 flex items-center justify-center rounded-lg">
                  <span className="text-white text-center p-2">
                    {show.name}
                  </span>
                </div>
              )}

              {/* Rating Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gray-900/80 text-white font-medium shadow-lg flex items-center gap-1">
                {show.vote_average > 0 ? (
                  <>
                    <span className="text-yellow-400">⭐</span>
                    <span>{show.vote_average.toFixed(1)}</span>
                  </>
                ) : new Date(show.first_air_date) > new Date() ? (
                  <span className="text-blue-400">Upcoming</span>
                ) : (
                  <span className="text-gray-400">No Rating</span>
                )}
              </div>

              {/* Watchlist Heart Icon */}
              <div className="absolute top-3 right-3 p-2 rounded-full bg-sky-900/80 hover:bg-sky-900 shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer">
                <span className="text-xl">🤍</span>
              </div>

              {/* Title Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent pt-8 pb-4 px-2 rounded-b-lg">
                <h3 className="text-white text-sm font-medium text-center line-clamp-2">
                  {show.name}
                </h3>
                <p className="text-gray-300 text-xs text-center opacity-80">
                  {show.first_air_date
                    ? new Date(show.first_air_date).getFullYear()
                    : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-16 m-2">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center text-white m-2 mt-4">
          <span className="block w-1 h-8 bg-blue-600 mr-3"></span>
          Upcoming Shows
        </h2>
        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-4 pb-4 hover:cursor-pointer scrollbar-hide">
          {upcoming.map((show) => (
            <div
              key={show.id}
              className="min-w-[160px] md:min-w-[200px] relative group"
              onClick={()=>{handleClick(show.id)}}
            >
              {show.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/original/${show.poster_path}`}
                  alt={show.name}
                  className="w-full h-auto rounded-lg shadow-lg object-cover transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
                />
              ) : (
                <div className="w-full h-64 bg-gray-800 flex items-center justify-center rounded-lg">
                  <span className="text-white text-center p-2">
                    {show.name}
                  </span>
                </div>
              )}

              {/* Watchlist Heart Icon */}
              <div className="absolute top-3 right-3 p-2 rounded-full bg-sky-900/80 hover:bg-sky-900 shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer">
                <span className="text-xl">🤍</span>
              </div>

              {/* Title Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent pt-8 pb-4 px-2 rounded-b-lg">
                <h3 className="text-white text-sm font-medium text-center line-clamp-2">
                  {show.name}
                </h3>
                <p className="text-gray-300 text-xs text-center opacity-80">
                  {show.first_air_date
                    ? new Date(show.first_air_date).getFullYear()
                    : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-16 m-2">
    <div className="flex justify-between items-center m-2 mt-4">
  <h2 className="text-2xl md:text-3xl font-bold flex items-center text-white">
    <span className="block w-1 h-8 bg-blue-600 mr-3"></span>
    Top Rated Shows in&nbsp;
    {{
      IN: "India",
      US: "USA",
      KR: "Korea",
      JP: "Japan",
      GB: "UK",
      FR: "France",
      DE: "Germany",
      CN: "China",
      ES: "Spain",
      IT: "Italy",
    }[country] || country}
  </h2>
  <select
    value={country}
    onChange={(e) => setCountry(e.target.value)}
    className="bg-gray-800 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
  >
    <option value="IN">India</option>
    <option value="US">USA</option>
    <option value="KR">Korea</option>
    <option value="JP">Japan</option>
    <option value="GB">UK</option>
    <option value="FR">France</option>
    <option value="DE">Germany</option>
    <option value="CN">China</option>
    <option value="ES">Spain</option>
    <option value="IT">Italy</option>
  </select>
</div>

<div className="flex  overflow-x-auto gap-4 pb-4 hover:cursor-pointer scrollbar-hide">
  {topRated.map((show) => (
    <div
      key={show.id}
      className="min-w-[160px] md:min-w-[200px] relative group"
      onClick={()=>{handleClick(show.id)}}
    >
      {show.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/original/${show.poster_path}`}
          alt={show.name}
          className="w-full h-auto rounded-lg shadow-lg object-cover transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
        />
      ) : (
        <div className="w-full h-64 bg-gray-800 flex items-center justify-center rounded-lg">
          <span className="text-white text-center p-2">{show.name}</span>
        </div>
      )}

      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gray-900/80 text-white font-medium shadow-lg flex items-center gap-1">
        {show.vote_average > 0 ? (
          <>
            <span className="text-yellow-400">⭐</span>
            <span>{show.vote_average.toFixed(1)}</span>
          </>
        ) : (
          <span className="text-gray-400">No Rating</span>
        )}
      </div>

      <div className="absolute top-3 right-3 p-2 rounded-full bg-sky-900/80 hover:bg-sky-900 shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer">
        <span className="text-xl">🤍</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent pt-8 pb-4 px-2 rounded-b-lg">
        <h3 className="text-white text-sm font-medium text-center line-clamp-2">
          {show.name}
        </h3>
        <p className="text-gray-300 text-xs text-center opacity-80">
          {show.first_air_date
            ? new Date(show.first_air_date).getFullYear()
            : ""}
        </p>
      </div>
    </div>
  ))}
</div>
      </div>
    </div>
  );
}

export default Tv;
