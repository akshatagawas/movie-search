import React from "react";
import Star from "./Star";

const MovieList = ({ movies }) => {
  return (
    <div className="movie-list-container">
      {movies.length > 0 ? (
        <div className="movie-box">
          {movies.map((movie) => (
            <div key={movie.title} className="movie-box">
              <h3 className="movie-title">{movie.title}</h3>
              <div className="star-rating">
                {Array.from({ length: 10 }, (_, i) => {
                  const filledPercentage =
                    i < Math.floor(movie.rating)
                      ? 100
                      : i === Math.floor(movie.rating)
                        ? (movie.rating % 1) * 100
                        : 0;
                  return <Star key={i} filledPercentage={filledPercentage} />;
                })}
              </div>
              <span className="genre">{movie.category}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies found.</p>
      )}
    </div>
  );
};

export default MovieList;
