// src/components/Elements/Rating.js
import React from "react";

const Rating = ({ rating = 0, numberOfRatings = 0 }) => {
  let roundedRating = Number(rating) || 0; // Ensure rating is a number or default to 0
  let ratingArray = Array(5).fill(false);
  
  for (let i = 0; i < Math.round(roundedRating); i++) {
    ratingArray[i] = true;
  }

  return (
    <div className="flex items-center">
      {ratingArray.map((value, index) => (
        value ? (
          <i
            key={index}
            className="text-lg bi bi-star-fill text-yellow-500 mr-1"
          ></i>
        ) : (
          <i
            key={index}
            className="text-lg bi bi-star text-gray-300 mr-1"
          ></i>
        )
      ))}
      <span className="ml-2 text-gray-700 dark:text-gray-400">
        ({roundedRating.toFixed(1)} / 5 based on {numberOfRatings} ratings)
      </span>
    </div>
  );
};

export default Rating;
