// src/pages/Cart/components/CartCard.js
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../context";

const CartCard = ({ product }) => {
  const { removeFromCart } = useCart();

  // List of fallback images
  const imagesList = ["10001", "10002", "10003", "10004", "10005"];

  // Randomly pick an image from the list if product.poster is not available
  const productImage =
    product.poster ||
    `/assets/images/${imagesList[Math.floor(Math.random() * imagesList.length)]}.avif`;

  return (
    <div className="flex flex-wrap justify-between border-b dark:border-slate-700 max-w-4xl m-auto p-4 mb-5 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex">
        <Link to={`/products/${product.id}`}>
          <img
            className="w-32 rounded"
            src={productImage} // Use the randomized or actual image
            alt={product.name || "No Name"}
          />
        </Link>
        <div className="ml-4 flex flex-col justify-between">
          <Link to={`/products/${product.id}`}>
            <p className="text-lg dark:text-slate-200 font-semibold">
              {product.gameName || product.name || "No product name available"}
            </p>
          </Link>
        </div>
      </div>

      {/* Align price and remove button together */}
      <div className="text-lg m-2 dark:text-slate-200 flex flex-col items-end justify-between">
        <span>${product.price ? product.price.toFixed(2) : "N/A"}</span>
        <button
          onClick={() => removeFromCart(product)}
          className="text-base text-red-400 hover:text-red-600 mt-2"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartCard;



