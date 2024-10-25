// src/pages/ProductDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Rating, RatingInput } from "../components/Elements";
import useTitle from "../hooks/useTitle";
import { useCart, useWishlist } from "../context";
import { getProduct, getProductList } from "../services";
import { getUserNameById } from "../services/dataService";

const ProductDetail = () => {
  const { cartList, addToCart, removeFromCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [product, setProduct] = useState({});
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [numberOfRatings, setNumberOfRatings] = useState(0);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  useTitle(product.gameName || "Product Detail");

  // List of random fallback images
  const imagesList = [
    "/assets/images/10001.avif",
    "/assets/images/10002.avif",
    "/assets/images/10003.avif",
    "/assets/images/10004.avif",
    "/assets/images/10005.avif",
  ];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProduct(id);
        console.log("Fetched Product Data:", data);
        setProduct(data);
        setAverageRating(data.rate || 0);
        setNumberOfRatings(data.gameReviews?.$values.length || 0);
        setUserRating(data.userRating || 0);

        // Filter approved reviews
        const approved = data.gameReviews?.$values.filter(
          (review) => review.approved === true
        );

        const reviewsWithUsers = await Promise.all(
          approved.map(async (review) => {
            const userName = await getUserNameById(review.memberID);
            return { ...review, user: userName };
          })
        );

        setApprovedReviews(reviewsWithUsers || []);

        const allProducts = await getProductList();
        const recommended = allProducts.filter((prod) => prod.id !== id);
        setRecommendedProducts(getRandomRecommendedGames(recommended));
      } catch (error) {
        toast.error(error.message, {
          closeButton: true,
          position: "bottom-center",
        });
      }
    }
    fetchProducts();
  }, [id]);

  useEffect(() => {
    const productInCart = cartList.find((item) => item.id === product.id);
    setInCart(Boolean(productInCart));

    const productInWishlist = wishlist.find((item) => item.id === product.id);
    setInWishlist(Boolean(productInWishlist));
  }, [cartList, wishlist, product.id]);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist.");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist.");
    }
  };

  const handleWriteReview = () => {
    navigate(`/submit-review?gameId=${product.id}`);
  };

  const handleRatingSubmit = (rating) => {
    setUserRating(rating);
    const newNumberOfRatings = numberOfRatings + 1;
    const newAverageRating =
      (averageRating * numberOfRatings + rating) / newNumberOfRatings;
    setAverageRating(newAverageRating);
    setNumberOfRatings(newNumberOfRatings);
    toast.success(`You rated this game ${rating} stars!`);
  };

  // Helper function to randomly select 2 recommended games from the list
  const getRandomRecommendedGames = (games) => {
    if (games.length <= 2) {
      return games; // Return all games if there are 2 or fewer
    }
    const shuffled = [...games].sort(() => 0.5 - Math.random()); // Shuffle the games array
    return shuffled.slice(0, 2); // Get the first two games
  };

  // Ensure there's always an image, either from the product or a random fallback
  const productImage =
    product.thumbnailPath ||
    imagesList[Math.floor(Math.random() * imagesList.length)];

  // Common button classes for consistent styling
  const buttonClass =
    "inline-flex items-center justify-center w-64 py-2 text-sm font-medium text-center text-white rounded-lg";

  return (
    <main className="mx-4 lg:mx-20">
      <section>
        <h1 className="mt-10 mb-5 text-4xl text-center font-bold text-gray-900 dark:text-slate-200">
          {product.gameName}
        </h1>
        <p className="mb-5 text-lg text-center text-gray-900 dark:text-slate-200">
          {product.overview}
        </p>
        <div className="flex flex-wrap justify-around">
          <div className="max-w-xl my-3">
            <img
              className="rounded w-full h-auto max-h-96 object-cover"
              src={productImage}
              alt={product.gameName}
            />
          </div>
          <div className="max-w-xl my-3">
            <p className="text-3xl font-bold text-gray-900 dark:text-slate-200">
              <span className="mr-1">$</span>
              <span className="">{product.price}</span>
            </p>
            <div className="my-3">
              <Rating rating={averageRating} />
            </div>
            <p className="my-4 select-none">
              {product.gamesInStock > 0 ? (
                <span className="font-semibold text-emerald-600 border bg-slate-100 rounded-lg px-3 py-1 mr-2">
                  INSTOCK
                </span>
              ) : (
                <span className="font-semibold text-rose-700 border bg-slate-100 rounded-lg px-3 py-1 mr-2">
                  OUT OF STOCK
                </span>
              )}
            </p>
            <p className="my-3 flex flex-col space-y-2">
              {!inCart ? (
                <button
                  onClick={() => addToCart(product)}
                  className={`${buttonClass} bg-blue-700 hover:bg-blue-800 ${
                    product.gamesInStock ? "" : "cursor-not-allowed opacity-50"
                  }`}
                  disabled={!product.gamesInStock}
                >
                  Add To Cart <i className="ml-1 bi bi-cart-plus"></i>
                </button>
              ) : (
                <button
                  onClick={() => removeFromCart(product)}
                  className={`${buttonClass} bg-red-600 hover:bg-red-800 ${
                    product.gamesInStock ? "" : "cursor-not-allowed opacity-50"
                  }`}
                  disabled={!product.gamesInStock}
                >
                  Remove Item <i className="ml-1 bi bi-cart-dash"></i>
                </button>
              )}

              {!inWishlist ? (
                <button
                  onClick={handleWishlistToggle}
                  className={`${buttonClass} bg-green-600 hover:bg-green-700`}
                >
                  Add To Wishlist <i className="ml-1 bi bi-heart"></i>
                </button>
              ) : (
                <button
                  onClick={handleWishlistToggle}
                  className={`${buttonClass} bg-red-600 hover:bg-red-700`}
                >
                  Remove from Wishlist <i className="ml-1 bi bi-heart-fill"></i>
                </button>
              )}
            </p>

            {/* Write a Review Button */}
            <button
              onClick={handleWriteReview}
              className={`${buttonClass} bg-purple-600 hover:bg-purple-700 mt-4`}
            >
              Write a Review <i className="ml-1 bi bi-pencil"></i>
            </button>
            <p className="text-lg text-gray-900 dark:text-slate-200">
              {product.long_description || ""}
            </p>
          </div>
        </div>
      </section>

      {/* Rating Section */}
      <section className="my-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-200 mb-3">
          Rate this Game
        </h2>
        <div className="flex items-center justify-center">
          <RatingInput
            currentRating={userRating}
            onSubmit={handleRatingSubmit}
          />
          <span className="ml-3 text-lg text-gray-900 dark:text-slate-200">
            Average Rating: {averageRating.toFixed(1)} ({numberOfRatings}{" "}
            Ratings)
          </span>
        </div>
      </section>

      {/* Approved Reviews Section */}
<section className="my-10">
  <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-200 mb-5 text-center">
    Reviews
  </h2>
  {approvedReviews.length > 0 ? (
    <div className="max-h-80 overflow-y-auto space-y-4 px-4">
      {approvedReviews.map((review) => (
        <div
          key={review.reviewID}
          className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"
        >
          <p className="text-lg text-gray-900 dark:text-slate-200">
            Member:{" "}
            {review.userProfile && review.userProfile.displayName
              ? review.userProfile.displayName
              : review.user || "Anonymous User"}
          </p>
          <p className="text-lg text-gray-700 dark:text-slate-400 whitespace-pre-wrap break-words">
            {review.reviewText}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-500 dark:text-slate-400">
      No approved reviews available.
    </p>
  )}
</section>

      {/* Game Recommendations Section */}
      <section className="mt-10 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-200 mb-5">
          Recommended Games
        </h2>
        <div className="flex flex-wrap justify-around">
          {recommendedProducts.length > 0 ? (
            recommendedProducts.map((recProduct) => {
              console.log("Recommended Product:", recProduct);

              // Determine the correct product name and image to use
              const recProductName =
                recProduct.name || recProduct.gameName || "Unknown Game";
              const recProductImage =
                recProduct.poster ||
                recProduct.thumbnailPath ||
                imagesList[Math.floor(Math.random() * imagesList.length)];

              return (
                <div key={recProduct.id} className="max-w-xs my-3">
                  <img
                    className="rounded w-full h-auto max-h-48 object-cover"
                    src={recProductImage}
                    alt={recProductName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        imagesList[
                          Math.floor(Math.random() * imagesList.length)
                        ];
                    }}
                  />
                  <p className="text-lg font-semibold text-gray-900 dark:text-slate-200 mt-3">
                    {recProductName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    ${recProduct.price ? recProduct.price.toFixed(2) : "N/A"}
                  </p>
                  <button
                    onClick={() => navigate(`/products/${recProduct.id}`)}
                    className="text-blue-500 hover:underline mt-2"
                  >
                    View Details
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 dark:text-slate-400">
              No recommendations available.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
