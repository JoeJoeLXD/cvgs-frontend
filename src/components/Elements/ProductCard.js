// src/components/Elements/ProductCard.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart, useWishlist } from "../../context";
import Rating from "./Rating";
import RatingInput from "./RatingInput";
//import { toast } from "react-toastify";

const ProductCard = ({ product = {} }) => {
  const { cartList, addToCart, removeFromCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [averageRating, setAverageRating] = useState(product.rate || 0);
  const [numberOfRatings, setNumberOfRatings] = useState(
    product.gameReviews?.$values.length || 0
  );
  const [userRating, setUserRating] = useState(product.userRating || 0);

  const {
    id,
    gameName = "Unknown Game",
    overview = "No overview available",
    thumbnailPath = "/assets/images/default-poster.png",
    price = 0,
    gamesInStock = true,
    gameCategory = {},
  } = product;

  useEffect(() => {
    const productInCart = cartList.find((item) => item.id === product.id);
    const productInWishlist = wishlist.find((item) => item.id === product.id);
    setInCart(Boolean(productInCart));
    setInWishlist(Boolean(productInWishlist));
  }, [cartList, wishlist, product.id]);

  const handleRatingSubmit = (rating) => {
    setUserRating(rating);
    const newNumberOfRatings = numberOfRatings + 1;
    const newAverageRating =
      (averageRating * numberOfRatings + rating) / newNumberOfRatings;
    setAverageRating(newAverageRating);
    setNumberOfRatings(newNumberOfRatings);
  };

  const imagesList = ["10001", "10002", "10003", "10004", "10005"];

  const isAuthenticated = !!sessionStorage.getItem("token");

  const handleAction = (actionFn) => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      actionFn();
    }
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      handleAction(() => {
        removeFromWishlist(product.id);
        setInWishlist(false);
        //toast.success("Removed from wishlist!", { autoClose: 1500 });
      });
    } else {
      handleAction(() => {
        addToWishlist(product);
        setInWishlist(true);
        //toast.success("Added to wishlist!", { autoClose: 1500 });
      });
    }
  };

  return (
    <div className="m-3 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/products/${id}`} className="relative">
        <img
          className="rounded-t-lg w-full h-64 object-cover"
          src={
            thumbnailPath ||
            `/assets/images/${imagesList[Math.floor(Math.random() * 5)]}.avif`
          }
          alt={gameName}
        />
      </Link>
      <div className="p-5">
        <Link to={`/products/${id}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {gameName}
          </h5>
        </Link>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {overview}
        </p>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
          Category: {gameCategory?.name || "Unknown Category"}
        </p>
        <div className="flex items-center my-2">
          <Rating rating={averageRating} numberOfRatings={numberOfRatings} />
        </div>
        <div className="flex items-center my-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-slate-200 mb-2">
            Rate this game:
          </p>
          <RatingInput
            currentRating={userRating}
            onSubmit={handleRatingSubmit}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl dark:text-gray-200">
            <span>$</span>
            <span>{price}</span>
          </span>

          <div className="flex flex-col space-y-2">
            {!inCart ? (
              <button
                onClick={() => handleAction(() => {
                  addToCart(product);
                  setInCart(true);
                })}
                className={`inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 ${
                  gamesInStock ? "" : "cursor-not-allowed opacity-50"
                }`}
                disabled={!gamesInStock}
              >
                Add to Cart <i className="ml-1 bi bi-plus-lg"></i>
              </button>
            ) : (
              <button
                onClick={() => handleAction(() => {
                  removeFromCart(product);
                  setInCart(false);
                })}
                className={`inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 ${
                  gamesInStock ? "" : "cursor-not-allowed opacity-50"
                }`}
                disabled={!gamesInStock}
              >
                Remove Item <i className="ml-1 bi bi-trash3"></i>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              className={`inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-center rounded-lg text-white ${
                inWishlist ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
