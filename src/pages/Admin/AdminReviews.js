// src/pages/Admin/AdminReviews.js
import React, { useState, useEffect } from "react";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false); // For individual actions

  // Fetch all reviews
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch("/api/reviews"); // Replace with your backend reviews endpoint
        const data = await response.json();
        setReviews(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  // Handle selecting a review
  const handleViewReview = (reviewId) => {
    const review = reviews.find((review) => review.id === reviewId);
    setSelectedReview(review);
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    setActionLoading(true);
    try {
      await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" }); // Replace with your backend delete review endpoint
      setReviews(reviews.filter((review) => review.id !== reviewId));
      setSelectedReview(null);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
    setActionLoading(false);
  };

  // Handle approving a review
  const handleApproveReview = async (reviewId) => {
    setActionLoading(true);
    try {
      await fetch(`/api/reviews/${reviewId}/approve`, { method: "POST" }); // Replace with your backend approve review endpoint
      setReviews(
        reviews.map((review) =>
          review.id === reviewId ? { ...review, approved: true } : review
        )
      );
    } catch (error) {
      console.error("Error approving review:", error);
    }
    setActionLoading(false);
  };

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold my-4">Manage Game Reviews</h1>

      <div className="flex">
        {/* Reviews List */}
        <div className="w-1/3 border-r pr-4">
          <h2 className="text-xl mb-4">Pending Reviews</h2>
          {reviews.length === 0 ? (
            <p>No reviews to display</p>
          ) : (
            <ul>
              {reviews.map((review) => (
                <li key={review.id} className="mb-3">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleViewReview(review.id)}
                  >
                    {review.title} ({review.approved ? "Approved" : "Pending"})
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Selected Review Details */}
        <div className="w-2/3 pl-4">
          {selectedReview ? (
            <div>
              <h2 className="text-xl mb-4">{selectedReview.title}</h2>
              <p>{selectedReview.content}</p>
              <p>
                <strong>Rating:</strong> {selectedReview.rating}/5
              </p>
              <div className="mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => handleApproveReview(selectedReview.id)}
                  disabled={selectedReview.approved || actionLoading}
                >
                  {selectedReview.approved ? "Approved" : "Approve"}
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleDeleteReview(selectedReview.id)}
                  disabled={actionLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <p>Select a review to view its details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;

