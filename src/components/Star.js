import React from "react";
import { FaStar } from "react-icons/fa";

const Star = ({ filledPercentage }) => {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: "24px",
        height: "24px",
      }}
    >
      <FaStar style={{ color: "#e4e5e9", width: "100%", height: "100%" }} />
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          clipPath: `inset(0 ${100 - filledPercentage}% 0 0)`,
        }}
      >
        <FaStar style={{ color: "#000", width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

export default Star;
