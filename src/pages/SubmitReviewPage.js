// src/pages/SubmitReviewPage.js
import React from "react";
import { useLocation } from "react-router-dom";

const SubmitReviewPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gameId = queryParams.get("gameId");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Submit Your Review for Game ID: {gameId}
      </h1>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Your Rating:</label>
          <select className="border p-2 w-full">
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Review:</label>
          <textarea
            rows="5"
            className="border p-2 w-full"
            placeholder="Write your review here..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default SubmitReviewPage;



