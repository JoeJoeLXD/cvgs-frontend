// src/components/Elements/ProductCard.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart, useWishlist } from "../../context";
import Rating from "./Rating";
import RatingInput from "./RatingInput"; 
//import { submitRating } from "../../services"; 

const ProductCard = ({ product = {} }) => {
  const { cartList, addToCart, removeFromCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [averageRating, setAverageRating] = useState(product.averageRating || 0);
  const [numberOfRatings, setNumberOfRatings] = useState(product.numberOfRatings || 0);
  const [userRating, setUserRating] = useState(product.userRating || 0);

  const {
    id,
    name = "Unknown Game",
    overview = "No overview available",
    poster = "",
    image_local = "",
    price = 0,
    best_seller = false,
    in_stock = true,
  } = product;

  useEffect(() => {
    const productInCart = cartList.find((item) => item.id === product.id);
    const productInWishlist = wishlist.find((item) => item.id === product.id);
    setInCart(Boolean(productInCart));
    setInWishlist(Boolean(productInWishlist));
  }, [cartList, wishlist, product.id]);

  // Simulate the rating submission
  const handleRatingSubmit = (rating) => {
    // Update the user's rating for the current product
    setUserRating(rating);
    // Update the average rating for display purposes (simulation)
    const newNumberOfRatings = numberOfRatings + 1;
    const newAverageRating = ((averageRating * numberOfRatings) + rating) / newNumberOfRatings;
    setAverageRating(newAverageRating);
    setNumberOfRatings(newNumberOfRatings);
  };

  return (
    <div className="m-3 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/products/${id}`} className="relative">
        {best_seller && (
          <span className="absolute top-4 left-2 px-2 bg-orange-500 bg-opacity-90 text-white rounded">
            Best Seller
          </span>
        )}
        <img
          className="rounded-t-lg w-full h-64 object-cover"
          src={poster || image_local || "/assets/images/default-poster.png"}
          alt={name}
        />
      </Link>
      <div className="p-5">
        <Link to={`/products/${id}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {name}
          </h5>
        </Link>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {overview}
        </p>
        <div className="flex items-center my-2">
          {/* Display the average rating */}
          <Rating rating={averageRating} numberOfRatings={numberOfRatings} />
        </div>
        <div className="flex items-center my-2">
        <p className="text-lg font-semibold text-gray-900 dark:text-slate-200 mb-2">
          Rate this game:
        </p>
          {/* Allow user to submit their rating */}
          <RatingInput currentRating={userRating} onSubmit={handleRatingSubmit} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl dark:text-gray-200">
            <span>$</span>
            <span>{price}</span>
          </span>

          <div className="flex flex-col space-y-2">
            {!inCart ? (
              <button
                onClick={() => addToCart(product)}
                className={`inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 ${
                  in_stock ? "" : "cursor-not-allowed opacity-50"
                }`}
                disabled={!in_stock}
              >
                Add To Cart <i className="ml-1 bi bi-plus-lg"></i>
              </button>
            ) : (
              <button
                onClick={() => removeFromCart(product)}
                className={`inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 ${
                  in_stock ? "" : "cursor-not-allowed opacity-50"
                }`}
                disabled={!in_stock}
              >
                Remove Item <i className="ml-1 bi bi-trash3"></i>
              </button>
            )}

            {!inWishlist ? (
              <button
                onClick={() => addToWishlist(product)}
                className="inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Add to Wishlist
              </button>
            ) : (
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Remove from Wishlist
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;