// src/pages/ProductDetail.js

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Rating, RatingInput } from "../components/Elements";
import useTitle from "../hooks/useTitle";
import { useCart, useWishlist } from "../context";
import { getProduct, getProductList } from "../services";

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
  const { id } = useParams();
  const navigate = useNavigate();
  useTitle(product.gameName || "Product Detail");

  // List of random fallback images
  const imagesList = [
    "/assets/images/10001.avif",
    "/assets/images/10002.avif",
    "/assets/images/10003.avif",
    "/assets/images/10004.avif",
    "/assets/images/10005.avif"
  ];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProduct(id);
        setProduct(data);
        setAverageRating(data.rate || 0);
        setNumberOfRatings(data.gameReviews?.$values.length || 0);
        setUserRating(data.userRating || 0);

        if (data.recommendations) {
          const allProducts = await getProductList();
          const recommended = allProducts.filter((prod) =>
            data.recommendations.includes(prod.id)
          );
          setRecommendedProducts(recommended);
        }
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

  // Ensure there's always an image, either from the product or a random fallback
  const productImage =
    product.thumbnailPath ||
    imagesList[Math.floor(Math.random() * imagesList.length)];

  return (
    <main>
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
            <p className="my-3">
              <Rating rating={averageRating} />
            </p>
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
                  className={`inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 ${
                    product.gamesInStock ? "" : "cursor-not-allowed opacity-50"
                  }`}
                  disabled={!product.gamesInStock}
                >
                  Add To Cart <i className="ml-1 bi bi-plus-lg"></i>
                </button>
              ) : (
                <button
                  onClick={() => removeFromCart(product)}
                  className={`inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 ${
                    product.gamesInStock ? "" : "cursor-not-allowed opacity-50"
                  }`}
                  disabled={!product.gamesInStock}
                >
                  Remove Item <i className="ml-1 bi bi-trash3"></i>
                </button>
              )}

              {!inWishlist ? (
                <button
                  onClick={handleWishlistToggle}
                  className="inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Add To Wishlist <i className="ml-1 bi bi-plus-lg"></i>
                </button>
              ) : (
                <button
                  onClick={handleWishlistToggle}
                  className="inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Remove from Wishlist
                </button>
              )}
            </p>

            {/* Write a Review Button */}
            <button
              onClick={handleWriteReview}
              className="inline-flex items-center justify-center py-2 px-3 mt-4 text-sm font-medium text-center text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Write a Review <i className="ml-1 bi bi-pencil"></i>
            </button>

            <p className="text-lg text-gray-900 dark:text-slate-200">
              {product.long_description || "No additional details available."}
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
          <RatingInput currentRating={userRating} onSubmit={handleRatingSubmit} />
          <span className="ml-3 text-lg text-gray-900 dark:text-slate-200">
            Average Rating: {averageRating.toFixed(1)} ({numberOfRatings} Ratings)
          </span>
        </div>
      </section>

      {/* Game Recommendations Section */}
      <section className="mt-10 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-200 mb-5">
          Recommended Games
        </h2>
        <div className="flex flex-wrap justify-around">
          {recommendedProducts.length > 0 ? (
            recommendedProducts.map((recProduct) => (
              <div key={recProduct.id} className="max-w-xs my-3">
                <img
                  className="rounded w-full h-auto max-h-48 object-cover"
                  src={
                    recProduct.poster ||
                    `/assets/images/${imagesList[Math.floor(Math.random() * imagesList.length)]}.avif`
                  } // Random image or poster
                  alt={recProduct.name}
                />
                <p className="text-lg font-semibold text-gray-900 dark:text-slate-200 mt-3">
                  {recProduct.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  ${recProduct.price}
                </p>
                <button
                  onClick={() => navigate(`/products/${recProduct.id}`)}
                  className="text-blue-500 hover:underline mt-2"
                >
                  View Details
                </button>
              </div>
            ))
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


