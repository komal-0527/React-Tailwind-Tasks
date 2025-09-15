import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./MovieDetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNmNkYmZkOTc5ZjdmM2I0NmUwOWY5MDdkNzZjM2ExZiIsIm5iZiI6IjY4YzdlZDU1NjY1YTA4NWQwZjcwZDgxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HuXGSU3GzDAXXOhD25eEFJoonyZO-tQiiyLPz328w44",
      },
    };

    // Fetch movie details
    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error(err));

    // Fetch trailer
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      options
    )
      .then((res) => res.json())
      .then((data) => {
        const officialTrailer = data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (officialTrailer) {
          setTrailer(officialTrailer.key);
        } else {
          // ✅ Dummy trailer fallback (YouTube ID of a random trailer)
          setTrailer("tgbNymZ7vqY"); // Example: Big Buck Bunny short movie
        }
      })
      .catch((err) => {
        console.error(err);
        // ✅ On error also set dummy trailer
        setTrailer("tgbNymZ7vqY");
      });
  }, [id]);

  if (!movie) return <p className="loading">Loading...</p>;

  return (
    <div className="movie-detail">
    
      {/* Content */}
      <div className="content">
        <h1 className="title">{movie.title}</h1>

        <div className="trailer">
          <iframe
            src={`https://www.youtube.com/embed/${trailer}`}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="info">
          <p className="overview">{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average} / 10
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
