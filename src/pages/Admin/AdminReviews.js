// src/pages/Admin/AdminReviews.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getUserNameById } from "../../services/dataService";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedReviewGame, setSelectedReviewGame] = useState("");
  const [actionLoading, setActionLoading] = useState(false); // For individual actions

  // Function to resolve references in the API response
  // const resolveRefs = (data) => {
  //   const refMap = {};
  //   // First, map all items by their $id
  //   data["$values"].forEach((item) => {
  //     if (item["$id"]) {
  //       refMap[item["$id"]] = item;
  //     }
  //   });

  //   // Resolve all $refs in the data
  //   const resolveItem = (item) => {
  //     for (const key in item) {
  //       if (typeof item[key] === "object" && item[key]["$ref"]) {
  //         item[key] = refMap[item[key]["$ref"]];
  //       }
  //     }
  //     return item;
  //   };

  //   return data["$values"].map(resolveItem);
  // };

  // Fetch all reviews
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch("https://localhost:7245/api/GameReviews");
        if (!response.ok) {
          throw new Error("Failed to load reviews");
        }
        const resolvedReviews = await response.json();

        const reviewsWithUsers = await Promise.all(
          resolvedReviews["$values"].map(async (review) => {
            const userName = await getUserNameById(review.memberID);
            return { ...review, user: userName };
          })
        );

        // Now set the reviews with resolved user names
        setReviews(reviewsWithUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews. Please try again later.");
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  // Handle selecting a review
  const handleViewReview = async (reviewId) => {
    const review = reviews.find((review) => review.reviewID === reviewId);
    const name = await getReviewGameName(review);

    setSelectedReview(review);
    setSelectedReviewGame(name);
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    setActionLoading(true);
    try {
      await fetch(`https://localhost:7245/api/GameReviews/${reviewId}`, {
        method: "DELETE",
      });
      setReviews(reviews.filter((review) => review.reviewID !== reviewId));
      setSelectedReview(null);
      toast.success("Review deleted successfully.");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review. Please try again later.");
    }
    setActionLoading(false);
  };

  // Handle approving a review
  const handleApproveReview = async (reviewId) => {
    setActionLoading(true);
    try {
      const reviewToUpdate = reviews.find(
        (review) => review.reviewID === reviewId
      );
      const updatedReview = {
        ...reviewToUpdate,
        approved: true,
        userProfile: undefined, // Ensure this is not sent if it’s not expected by the server
        game: undefined, // Ensure this is not sent if it’s not expected by the server
      };

      console.log("Updated Review Data:", updatedReview);

      const response = await fetch(
        `https://localhost:7245/api/GameReviews/${reviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedReview),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to approve review: ${response.statusText}`);
      }

      setReviews(
        reviews.map((review) =>
          review.reviewID === reviewId ? { ...review, approved: true } : review
        )
      );
      toast.success("Review approved successfully.");
    } catch (error) {
      console.error("Error approving review:", error);
      toast.error("Failed to approve review. Please try again later.");
    }
    setActionLoading(false);
  };

  const getReviewGameName = async (review) => {
    try {
      const gameResponse = await fetch(
        `https://localhost:7245/api/Games/${review.gameID}`
      );
      if (!gameResponse.ok) {
        throw new Error("Failed to fetch game details for wishlist");
      }
      const gameData = await gameResponse.json();
      return gameData.gameName;
    } catch (error) {
      console.error(
        `Error fetching game with ID ${review.gameID}:`,
        error.message
      );
      return null;
    }
  };

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-semibold my-4 dark:text-white">
        Manage Game Reviews
      </h1>

      <div className="flex">
        {/* Reviews List */}
        <div className="w-1/3 border-r pr-4 dark:border-gray-700">
          <h2 className="text-xl mb-4 dark:text-white">Pending Reviews</h2>
          {Array.isArray(reviews) && reviews.length > 0 ? (
            <ul>
              {reviews
                .filter((review) => review.reviewID && !review.approved) // Show only pending reviews
                .map((review) => (
                  <li key={review.reviewID} className="mb-3">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition dark:bg-blue-700 dark:hover:bg-blue-600"
                      onClick={() => handleViewReview(review.reviewID)}
                    >
                      Review by {review.user || "Anonymous User"} (Pending)
                    </button>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="dark:text-gray-300">No reviews to display</p>
          )}
        </div>

        {/* Selected Review Details */}
        <div className="w-2/3 pl-4">
          {selectedReview ? (
            <div>
              <h2 className="text-xl mb-4 dark:text-white">
                Review by {selectedReview.user || "Anonymous User"}
              </h2>
              <p className="dark:text-gray-300">
                <strong>Game:</strong> {selectedReviewGame || "Unknown Game"}
              </p>
              <p className="dark:text-gray-300">{selectedReview.reviewText}</p>
              <div className="mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600 transition dark:bg-green-700 dark:hover:bg-green-600"
                  onClick={() => handleApproveReview(selectedReview.reviewID)}
                  disabled={selectedReview.approved || actionLoading}
                >
                  {selectedReview.approved ? "Approved" : "Approve"}
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition dark:bg-red-700 dark:hover:bg-red-600"
                  onClick={() => handleDeleteReview(selectedReview.reviewID)}
                  disabled={actionLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <p className="dark:text-gray-300">
              Select a review to view its details
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
