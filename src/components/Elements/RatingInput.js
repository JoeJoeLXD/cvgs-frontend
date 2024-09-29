// src/components/Elements/RatingInputs.js
import React, { useState } from "react";

const RatingInput = ({ currentRating = 0, onSubmit }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(currentRating);

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    if (onSubmit) {
      onSubmit(rating);
    }
  };

  const handleStarHover = (rating) => {
    setHoverRating(rating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="flex items-center">
      {Array(5).fill(0).map((_, index) => {
        const starIndex = index + 1;
        return (
          <i
            key={index}
            className={`text-lg ${
              hoverRating >= starIndex || selectedRating >= starIndex
                ? "bi bi-star-fill text-yellow-500"
                : "bi bi-star text-gray-300"
            } mr-1 cursor-pointer`}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => handleStarHover(starIndex)}
            onMouseLeave={handleStarLeave}
          ></i>
        );
      })}
    </div>
  );
};

export default RatingInput;
