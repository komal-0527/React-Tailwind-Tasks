import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import Favorites from "./pages/Favorites/Favorites";
import Navbar from "./components/Navbar/Navbar";

const App = () => {
  // ✅ Load favorites from localStorage
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ✅ Add / Remove from favorites
  const toggleFavorite = (movie) => {
    if (favorites.some((fav) => fav.id === movie.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== movie.id)); // remove
    } else {
      setFavorites([...favorites, movie]); // add
    }
  };

  return (
    <div>
      <Navbar onSearch={setSearchQuery} favorites={favorites} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              searchQuery={searchQuery}
              toggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/movie/:id"
          element={
            <MovieDetail
              toggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <Favorites
              favorites={favorites}
              toggleFavorite={toggleFavorite} // ✅ Pass function too
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
