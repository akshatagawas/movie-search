import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { FaStar } from "react-icons/fa";

const moviesData = [
  { title: "The Matrix", rating: 7.5, category: "Action" },
  { title: "Focus", rating: 6.9, category: "Comedy" },
  { title: "The Lazarus Effect", rating: 6.4, category: "Thriller" },
  { title: "Everly", rating: 5.0, category: "Action" },
  { title: "Maps to the Stars", rating: 7.5, category: "Drama" },
];

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [displayMovies, setDisplayMovies] = useState(false); 

  const ratingRef = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        ratingRef.current &&
        !ratingRef.current.contains(event.target) &&
        categoryRef.current &&
        !categoryRef.current.contains(event.target)
      ) {
        setRatingDropdownOpen(false);
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (selectedRatings.length > 0 || selectedCategories.length > 0 || searchTerm !== "") {
      setDisplayMovies(true);
    } else {
      setDisplayMovies(false);
    }
  }, [selectedRatings, selectedCategories, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRatingChange = (rating) => {
    if (rating === "any") {
      if (selectedRatings.length === 0 || !selectedRatings.includes("any")) {
        setSelectedRatings(["any", ...Array.from({ length: 10 }, (_, index) => index + 1)]);
      } else {
        setSelectedRatings([]);
      }
    } else {
      const ratingToUse = Math.floor(rating);

      if (selectedRatings.includes("any")) {
        setSelectedRatings((prevSelectedRatings) =>
          prevSelectedRatings.includes(ratingToUse)
            ? prevSelectedRatings.filter((r) => r !== ratingToUse && r !== "any")
            : [...prevSelectedRatings, ratingToUse]
        );
      } else {
        setSelectedRatings((prevSelectedRatings) =>
          prevSelectedRatings.includes(ratingToUse)
            ? prevSelectedRatings.filter((r) => r !== ratingToUse)
            : [...prevSelectedRatings, ratingToUse]
        );
      }
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter((c) => c !== category)
        : [...prevSelectedCategories, category]
    );
  };

  const filteredMovies = moviesData.filter((movie) => {
    const matchesSearchTerm =
      movie.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = selectedRatings.includes("any") ||
      selectedRatings.length === 0 ||
      selectedRatings.some(r => Math.floor(movie.rating) === r);

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(movie.category);

    return matchesSearchTerm && matchesRating && matchesCategory;
  });

  const toggleRatingDropdown = () => {
    setRatingDropdownOpen(!ratingDropdownOpen);
    if (categoryDropdownOpen) {
      setCategoryDropdownOpen(false);
    }
  };

  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
    if (ratingDropdownOpen) {
      setRatingDropdownOpen(false);
    }
  };

  return (
    <div className="container">
      <div className="filter-container">
        <input
          type="text"
          placeholder="Enter movie name"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setSearchTerm("")}
          className="search-input"
        />
        <div className="dropdown" ref={ratingRef}>
          <button
            className="dropdown-toggle"
            onClick={toggleRatingDropdown}
          >
            <span className="dropdown-name">Rating</span>
            <span className={`arrow ${ratingDropdownOpen ? "up" : "down"}`}></span>
          </button>
          {ratingDropdownOpen && (
            <div className="dropdown-menu">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  value="any"
                  onChange={() => handleRatingChange("any")}
                  checked={selectedRatings.includes("any")}
                />
                Any
              </label>
              {Array.from({ length: 10 }, (_, index) => index + 1).map((rating) => (
                <label key={rating} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={rating}
                    onChange={() => handleRatingChange(rating)}
                    checked={selectedRatings.includes(rating)}
                  />
                  <div className="star-rating">
                    {Array.from({ length: 10 }, (_, i) => (
                      <FaStar
                        key={i}
                        color={i < rating ? "#000" : "#e4e5e9"}
                        className="star"
                      />
                    ))}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="dropdown" ref={categoryRef}>
          <button
            className="dropdown-toggle"
            onClick={toggleCategoryDropdown}
          >
            <span className="dropdown-name">Category</span>
            <span className={`arrow ${categoryDropdownOpen ? "up" : "down"}`}></span>
          </button>
          {categoryDropdownOpen && (
            <div className="dropdown-menu">
              {[...new Set(moviesData.map((movie) => movie.category))].map(
                (category) => (
                  <label key={category} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={category}
                      onChange={() => handleCategoryChange(category)}
                      checked={selectedCategories.includes(category)}
                    />
                    {category}
                  </label>
                )
              )}
            </div>
          )}
        </div>
      </div>
      {displayMovies && (
        <div className="movie-list-container">
          {filteredMovies.length > 0 ? (
            <div className="movie-box-container">
              {filteredMovies.map((movie, index) => (
                <div key={movie.title} className="movie-box">
                  <h3 className="movie-title">{movie.title}</h3>
                  
                  <div className="star-rating">
                    {Array.from({ length: 10 }, (_, i) => {
                      // Determine the fill color for each star
                      let starColor;
                      if (i < Math.floor(movie.rating)) {
                        // Full star
                        starColor = "#000";
                      } else if (i === Math.floor(movie.rating)) {
                        // Partial star based on decimal part
                        const decimalPart = movie.rating - Math.floor(movie.rating);

                        starColor =  "linear-gradient(to right, #1fa2ff, #12d8fa, #a6ffcb)";
                        console.log(decimalPart);
                      } else {
                        // Empty star
                        starColor = "#e4e5e9";
                      }
                      
                      // Render the star component with the determined color
                      return(
                        <>
                          <div className="partial-star">
                            <FaStar key={i} color={starColor} className="star" />
                          </div>
                        </>
                      ) 
                      
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
      )}
    </div>
  );
};

export default App;
