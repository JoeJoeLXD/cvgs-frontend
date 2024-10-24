// src/components/Wishlist.js
import React from "react";
import { useWishlist } from "../context"; // Assuming you're using the Wishlist context

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist(); // Access the remove function from context

  // List of fallback images, similar to what you did in ProductDetail.js
  const imagesList = [
    "/assets/images/10001.avif",
    "/assets/images/10002.avif",
    "/assets/images/10003.avif",
    "/assets/images/10004.avif",
    "/assets/images/10005.avif",
  ];

  return (
    <div>
      <h2>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.wishListID} className="wishlist-item border p-4 rounded-lg shadow-lg">
              <img
                src={
                  item.game?.poster ||
                  item.game?.image_local ||
                  imagesList[Math.floor(Math.random() * imagesList.length)] // Random fallback image
                }
                alt={item.game?.gameName || "No Name"}
                className="wishlist-image w-full h-48 object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold mt-3">
                {item.game?.gameName || "No Name"}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {item.game?.overview || "No overview available"}
              </p>

              {/* Remove from Wishlist Button */}
              <button
                onClick={() => removeFromWishlist(item.wishListID)}  // Remove game from wishlist
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;




