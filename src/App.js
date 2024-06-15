import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import SearchInput from "./components/Search";
import Dropdown from "./components/Dropdown";
import MovieList from "./components/Movies";

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
    if (
      selectedRatings.length > 0 ||
      selectedCategories.length > 0 ||
      searchTerm !== ""
    ) {
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
        setSelectedRatings([
          "any",
          ...Array.from({ length: 10 }, (_, index) => index + 1),
        ]);
      } else {
        setSelectedRatings([]);
      }
    } else {
      const ratingToUse = Math.floor(rating);

      if (selectedRatings.includes("any")) {
        setSelectedRatings((prevSelectedRatings) =>
          prevSelectedRatings.includes(ratingToUse)
            ? prevSelectedRatings.filter(
                (r) => r !== ratingToUse && r !== "any",
              )
            : [...prevSelectedRatings, ratingToUse],
        );
      } else {
        setSelectedRatings((prevSelectedRatings) =>
          prevSelectedRatings.includes(ratingToUse)
            ? prevSelectedRatings.filter((r) => r !== ratingToUse)
            : [...prevSelectedRatings, ratingToUse],
        );
      }
    }
  };

  const handleCategoryChange = (category) => {
    if (category === "any") {
      if (
        selectedCategories.length === 0 ||
        !selectedCategories.includes("any")
      ) {
        setSelectedCategories([
          "any",
          ...new Set(moviesData.map((movie) => movie.category)),
        ]);
      } else {
        setSelectedCategories([]);
      }
    } else {
      if (selectedCategories.includes("any")) {
        setSelectedCategories((prevSelectedCategories) =>
          prevSelectedCategories.includes(category)
            ? prevSelectedCategories.filter(
                (c) => c !== category && c !== "any",
              )
            : [...prevSelectedCategories, category],
        );
      } else {
        setSelectedCategories((prevSelectedCategories) =>
          prevSelectedCategories.includes(category)
            ? prevSelectedCategories.filter((c) => c !== category)
            : [...prevSelectedCategories, category],
        );
      }
    }
  };

  const filteredMovies = moviesData.filter((movie) => {
    const matchesSearchTerm = movie.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesRating =
      selectedRatings.includes("any") ||
      selectedRatings.length === 0 ||
      selectedRatings.some((r) => Math.floor(movie.rating) === r);

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(movie.category);

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
        <SearchInput
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
        <Dropdown
          title="Rating"
          options={Array.from({ length: 10 }, (_, index) => index + 1)}
          selectedOptions={selectedRatings}
          onOptionChange={handleRatingChange}
          isOpen={ratingDropdownOpen}
          toggleDropdown={toggleRatingDropdown}
          type="rating"
          refProp={ratingRef}
        />
        <Dropdown
          title="Genre"
          options={[...new Set(moviesData.map((movie) => movie.category))]}
          selectedOptions={selectedCategories}
          onOptionChange={handleCategoryChange}
          isOpen={categoryDropdownOpen}
          toggleDropdown={toggleCategoryDropdown}
          type="category"
          refProp={categoryRef}
        />
      </div>
      {displayMovies && <MovieList movies={filteredMovies} />}
    </div>
  );
};

export default App;
