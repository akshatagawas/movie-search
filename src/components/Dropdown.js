import React, { useRef, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const Dropdown = ({
  title,
  options,
  selectedOptions,
  onOptionChange,
  isOpen,
  toggleDropdown,
  type,
  refProp,
}) => {
  const anyLabel = type === "rating" ? "Any Rating" : "Any Genre";

  return (
    <div className="dropdown" ref={refProp}>
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        <span className="dropdown-name">{title}</span>
        <span className={`arrow ${isOpen ? "up" : "down"}`}></span>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <label className="checkbox-label">
            <input
              type="checkbox"
              value="any"
              onChange={() => onOptionChange("any")}
              checked={selectedOptions.includes("any")}
            />
            {anyLabel}
          </label>
          {options.map((option) => (
            <label key={option} className="checkbox-label">
              <input
                type="checkbox"
                value={option}
                onChange={() => onOptionChange(option)}
                checked={selectedOptions.includes(option)}
              />
              {type === "rating" ? (
                <div className="star-rating">
                  {Array.from({ length: 10 }, (_, i) => (
                    <FaStar
                      key={i}
                      color={i < option ? "#000" : "#e4e5e9"}
                      className="star"
                    />
                  ))}
                </div>
              ) : (
                option
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
