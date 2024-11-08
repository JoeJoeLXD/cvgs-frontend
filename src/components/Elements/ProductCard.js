// src/components/Elements/ProductCard.js

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart, useWishlist } from "../../context";

const ProductCard = ({ product = {} }) => {
  const { cartList, addToCart, removeFromCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const {
    id,
    gameName = "Unknown Game",
    overview = "No overview available",
    thumbnailPath = "/assets/images/default-poster.png",
    price = 0,
    gamesInStock = true,
    gameCategory = { name: "Uncategorized" },
  } = product;

  const categoryName = gameCategory.name || "Uncategorized";

  useEffect(() => {
    setInCart(cartList.some((item) => item.id === product.id));
    setInWishlist(wishlist.some((item) => item.gameID === product.id));
  }, [cartList, wishlist, product.id]);

  const imagesList = [
    "10001",
    "10002",
    "10003",
    "10004",
    "10005",
    "Action_1",
    "Action_2",
    "Action_3",
    "Action_4",
    "Action_5",
    "Action_6",
    "Adventure_1",
    "Adventure_2",
    "Adventure_3",
    "Adventure_4",
    "Adventure_5",
    "Adventure_6",
    "Fighting_1",
    "Fighting_2",
    "Fighting_3",
    "Fighting_4",
    "Fighting_5",
    "Fighting_6",
    "Horror_1",
    "Horror_2",
    "Horror_3",
    "Horror_4",
    "Horror_5",
    "Horror_6",
    "Puzzle_1",
    "Puzzle_2",
    "Puzzle_3",
    "Puzzle_4",
    "Puzzle_5",
    "Puzzle_6",
    "Racing_1",
    "Racing_2",
    "Racing_3",
    "Racing_4",
    "Racing_5",
    "Racing_6",
    "RPG_1",
    "RPG_2",
    "RPG_3",
    "RPG_4",
    "RPG_5",
    "RPG_6",
    "Simulation_1",
    "Simulation_2",
    "Simulation_3",
    "Simulation_4",
    "Simulation_5",
    "Simulation_6",
    "Sports_1",
    "Sports_2",
    "Sports_3",
    "Sports_4",
    "Sports_5",
    "Sports_6",
    "Strategy_1",
    "Strategy_2",
    "Strategy_3",
    "Strategy_4",
    "Strategy_5",
    "Strategy_6",
  ];

  const handleAction = (actionFn) => {
    if (!sessionStorage.getItem("token")) {
      navigate("/login");
    } else {
      actionFn();
    }
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      handleAction(() => {
        console.log(product);
        let wishListItem = wishlist.find((item) => item.gameID === product.id);
        removeFromWishlist(wishListItem.wishListID);
        setInWishlist(false);
      });
    } else {
      // Prevent adding if already in wishlist
      if (!inWishlist) {
        handleAction(() => {
          addToWishlist(product);
          setInWishlist(true);
        });
      }
    }
  };

  return (
    <div className="m-3 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/products/${id}`} className="relative">
        <img
          className="rounded-t-lg w-full h-64 object-cover"
          src={
            thumbnailPath ||
            `/assets/images/${imagesList[Math.floor(Math.random() * 65)]}.avif`
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
          Category: {categoryName}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl dark:text-gray-200">
            <span>$</span>
            <span>{price}</span>
          </span>

          <div className="flex flex-col space-y-2">
            {!inCart ? (
              <button
                onClick={() =>
                  handleAction(() => {
                    addToCart(product);
                    setInCart(true);
                  })
                }
                className={`inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 ${
                  gamesInStock ? "" : "cursor-not-allowed opacity-50"
                }`}
                disabled={!gamesInStock}
              >
                Add to Cart <i className="ml-1 bi bi-cart-plus"></i>
              </button>
            ) : (
              <button
                onClick={() =>
                  handleAction(() => {
                    removeFromCart(product);
                    setInCart(false);
                  })
                }
                className={`inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 ${
                  gamesInStock ? "" : "cursor-not-allowed opacity-50"
                }`}
                disabled={!gamesInStock}
              >
                Remove Item <i className="ml-1 bi bi-cart-dash"></i>
              </button>
            )}

            <button
              onClick={handleToggleWishlist}
              className={`inline-flex items-center justify-center py-2 px-3 text-sm font-medium text-center rounded-lg text-white ${
                inWishlist
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {inWishlist ? (
                <>
                  Remove from Wishlist <i className="ml-1 bi bi-heart-fill"></i>
                </>
              ) : (
                <>
                  Add to Wishlist <i className="ml-1 bi bi-heart"></i>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
