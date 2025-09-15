import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // React Icons
import "./TitleCards.css";
import cards_data from "../../assets/cards/Cards_data";

const TitleCards = ({ title, category, toggleFavorite, favorites, searchQuery = "" }) => {
  const cardsRef = useRef();
  const [movies, setMovies] = useState([]);

  //  Fetch movies
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNmNkYmZkOTc5ZjdmM2I0NmUwOWY5MDdkNzZjM2ExZiIsIm5iZiI6IjY4YzdlZDU1NjY1YTA4NWQwZjcwZDgxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HuXGSU3GzDAXXOhD25eEFJoonyZO-tQiiyLPz328w44",
      },
    };

    const endpoint = category ? category : "now_playing";

    fetch(`https://api.themoviedb.org/3/movie/${endpoint}?language=en-US&page=1`, options)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.results) {
          setMovies(data.results);
        } else {
          setMovies(cards_data);
        }
      })
      .catch(() => setMovies(cards_data));
  }, [category]);

  //  Filter movies by search
  const filteredMovies = movies.filter((movie) => {
    const movieTitle = (movie.title || movie.name || "").toLowerCase();
    return movieTitle.includes(searchQuery.toLowerCase());
  });

  //  Horizontal scroll with mouse wheel
  useEffect(() => {
    const cardList = cardsRef.current;
    const handleWheel = (event) => {
      event.preventDefault();
      cardList.scrollLeft += event.deltaY;
    };
    if (cardList) cardList.addEventListener("wheel", handleWheel);
    return () => {
      if (cardList) cardList.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="title-cards">
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie, index) => {
            const isFav = favorites.some((fav) => fav.id === movie.id);
            return (
              <div key={index} className="card">
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : movie.image
                    }
                    alt={movie.title || movie.name}
                  />
                  <div className="card-overlay">
                    <p>{movie.title || movie.name}</p>
                  </div>
                </Link>
                {/*  Favorite button */}
                <button
                  className={`heart-btn ${isFav ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault(); // stop link navigation
                    toggleFavorite(movie);
                  }}
                >
                  {isFav ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>
            );
          })
        ) : (
          <p className="no-results">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default TitleCards;
