// src/components/Wishlist.js
import React from "react";

const Wishlist = ({ wishlist }) => {
  return (
    <div>
      <h2>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product.id} className="wishlist-item">
              <img
                src={product.poster || product.image_local || "/assets/images/default-poster.png"}
                alt={product.name || "No Name"}
                className="wishlist-image"
              />
              <h3>{product.name || "No Name"}</h3>
              <p>{product.overview || "No overview available"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
