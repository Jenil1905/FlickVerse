import { useState, useEffect, useRef } from "react";
import "./App.css";
import Banner from "./components/Banner";
import Movies from "./components/Movies";
import NavBar from "./components/Navbar";
import Tv from "./components/Tv";
import Watchlist from "./components/Watchlist";
import Info from "./components/Info";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TvBanner from "./components/TvBanner";
import TVInfo from "./components/TVInfo";
import Search from "./components/Search";

function App() {
  const [watchlist, setWatchlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);

  function handleWatchlist(movieObj) {
    let updatedWatchlist = [...watchlist, movieObj];
    setWatchlist(updatedWatchlist);
    localStorage.setItem("wlMovies", JSON.stringify(updatedWatchlist));
  }

  function handleRemoveFromWatchlist(movieObj) {
    const updatedWatchlist = watchlist.filter(
      (movie) => movie.id !== movieObj.id
    );
    setWatchlist(updatedWatchlist);
    localStorage.setItem("wlMovies", JSON.stringify(updatedWatchlist));
  }

  useEffect(() => {
    const movies = localStorage.getItem("wlMovies");
    const parsedMovies = movies ? JSON.parse(movies) : [];
    setWatchlist(parsedMovies);
  }, []);

  return (
    <div>
      <BrowserRouter>
        <NavBar />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Banner
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  searchRef={searchRef}
                />
                <Movies
                  handleAddtoWatchlist={handleWatchlist}
                  watchlist={watchlist}
                  handleRemoveFromWatchlist={handleRemoveFromWatchlist}
                  searchTerm={searchTerm}
                  searchRef={searchRef}
                />
              </>
            }
          />
          <Route
            path="/watchlist"
            element={
              <Watchlist
                watchlist={watchlist}
                handleRemoveFromWatchlist={handleRemoveFromWatchlist}
              />
            }
          />
          <Route
            path="/tv"
            element={
              <>
                <TvBanner
                  searchRef={searchRef}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                <Tv />
              </>
            }
          />
          <Route path="/info/:id" element={<Info />} />
          <Route path="/tvinfo/:id" element={<TVInfo />} />
          <Route
            path="/search"
            element={
              <Search
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchRef={searchRef}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
