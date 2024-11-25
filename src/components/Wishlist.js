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
    "/assets/images/Action_1.avif",
    "/assets/images/Action_2.avif",
    "/assets/images/Action_3.avif",
    "/assets/images/Action_4.avif",
    "/assets/images/Action_5.avif",
    "/assets/images/Action_6.avif",
    "/assets/images/Adventure_1.avif",
    "/assets/images/Adventure_2.avif",
    "/assets/images/Adventure_3.avif",
    "/assets/images/Adventure_4.avif",
    "/assets/images/Adventure_5.avif",
    "/assets/images/Adventure_6.avif",
    "/assets/images/Fighting_1.avif",
    "/assets/images/Fighting_2.avif",
    "/assets/images/Fighting_3.avif",
    "/assets/images/Fighting_4.avif",
    "/assets/images/Fighting_5.avif",
    "/assets/images/Fighting_6.avif",
    "/assets/images/Racing_1.avif",
    "/assets/images/Racing_2.avif",
    "/assets/images/Racing_3.avif",
    "/assets/images/Racing_4.avif",
    "/assets/images/Racing_5.avif",
    "/assets/images/Racing_6.avif",
    "/assets/images/RPG_1.avif",
    "/assets/images/RPG_2.avif",
    "/assets/images/RPG_3.avif",
    "/assets/images/RPG_4.avif",
    "/assets/images/RPG_5.avif",
    "/assets/images/RPG_6.avif",
    "/assets/images/Horror_1.avif",
    "/assets/images/Horror_2.avif",
    "/assets/images/Horror_3.avif",
    "/assets/images/Horror_4.avif",
    "/assets/images/Horror_5.avif",
    "/assets/images/Horror_6.avif",
    "/assets/images/Simulation_1.avif",
    "/assets/images/Simulation_2.avif",
    "/assets/images/Simulation_3.avif",
    "/assets/images/Simulation_4.avif",
    "/assets/images/Simulation_5.avif",
    "/assets/images/Simulation_6.avif",
    "/assets/images/Sports_1.avif",
    "/assets/images/Sports_2.avif",
    "/assets/images/Sports_3.avif",
    "/assets/images/Sports_4.avif",
    "/assets/images/Sports_5.avif",
    "/assets/images/Sports_6.avif",
    "/assets/images/Strategy_1.avif",
    "/assets/images/Strategy_2.avif",
    "/assets/images/Strategy_3.avif",
    "/assets/images/Strategy_4.avif",
    "/assets/images/Strategy_5.avif",
    "/assets/images/Strategy_6.avif",
    "/assets/images/Puzzle_1.avif",
    "/assets/images/Puzzle_2.avif",
    "/assets/images/Puzzle_3.avif",
    "/assets/images/Puzzle_4.avif",
    "/assets/images/Puzzle_5.avif",
    "/assets/images/Puzzle_6.avif",
  ];

  return (
    <main className="container mx-auto max-w-6xl px-4 sm:px-8 lg:px-16 py-6">
      <h2 className="text-2xl font-bold mb-6">Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <div
              key={item.wishListID}
              className="wishlist-item border p-4 rounded-lg shadow-lg"
            >
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
                onClick={() => removeFromWishlist(item.wishListID)} // Remove game from wishlist
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Wishlist;
