// src/pages/SubmitReviewPage.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SubmitReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const gameId = queryParams.get("gameId");

  // State variables for form inputs
  const [reviewText, setReviewText] = useState("");
  const [gameName, setGameName] = useState("");

  // Fetch game details to get the game name
  useEffect(() => {
    const fetchGameName = async () => {
      try {
        const response = await fetch(`https://localhost:7245/api/Games/${gameId}`);
        if (response.ok) {
          const gameData = await response.json();
          setGameName(gameData.gameName);
        } else {
          console.error("Failed to fetch game details");
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };

    if (gameId) {
      fetchGameName();
    }
  }, [gameId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // User authentication validation (assuming a token exists in session storage)
    const memberId = sessionStorage.getItem("userId");
    if (!memberId) {
      toast.error("You must be logged in to submit a review.");
      navigate("/login");
      return;
    }

    const reviewData = {
      GameID: gameId,
      MemberID: memberId,
      ReviewText: reviewText,
      ReviewDate: new Date().toISOString(),
      Approved: false, // New reviews need admin approval
    };

    try {
      const response = await fetch("https://localhost:7245/api/GameReviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        toast.success("Your review has been submitted and is pending approval.");
        setReviewText("");
        navigate(`/products/${gameId}`);
      } else {
        const errorData = await response.json();
        console.error("Response error:", errorData);
        toast.error("Failed to submit your review. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting your review.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Submit Your Review for Game: {gameName || "Loading..."}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Review:</label>
          <textarea
            rows="5"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
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

