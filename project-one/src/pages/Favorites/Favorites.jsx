import React from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa"; //  React Icon
import "./Favorites.css";

const Favorites = ({ favorites, toggleFavorite }) => {
  return (
    <div className="favorites-page">
      <h2>My Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div className="favorites-list">
          {favorites.map((movie) => (
            <div key={movie.id} className="favorite-card">
              {/* Movie Link */}
              <Link to={`/movie/${movie.id}`} className="favorite-link">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : movie.image
                  }
                  alt={movie.title || movie.name}
                />
                <p>{movie.title || movie.name}</p>
              </Link>

              {/* Remove Button with React Icon */}
              <button
                className="remove-btn"
                onClick={() => toggleFavorite(movie)}
              >
                <FaTrashAlt /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
