import React from "react";

const SearchInput = ({ searchTerm, onSearchChange }) => {
  return (
    <input
      type="text"
      placeholder="Enter movie name"
      value={searchTerm}
      onChange={onSearchChange}
      onFocus={() => onSearchChange({ target: { value: "" } })}
      className="search-input"
    />
  );
};

export default SearchInput;
