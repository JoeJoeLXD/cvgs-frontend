// src/context/WishlistContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Method to fetch wishlist from the backend API
  const fetchWishlist = async () => {
    try {
      const memberID = sessionStorage.getItem("userId"); // Retrieve memberID dynamically
      const token = sessionStorage.getItem("token"); // Retrieve token for authentication

      if (!memberID || !token) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(
        `https://localhost:7245/api/WishLists?memberID=${memberID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token for auth
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();
      console.log("Fetched wishlist data:", data); // Log fetched data for debugging

      const fetchedWishlist = await Promise.all(
        data.$values.map(async (wishItem) => {
          if (wishItem.gameID) {
            try {
              const gameResponse = await fetch(
                `https://localhost:7245/api/Games/${wishItem.gameID}`
              );
              if (!gameResponse.ok) {
                throw new Error("Failed to fetch game details for wishlist");
              }
              const gameData = await gameResponse.json();
              return { ...wishItem, game: gameData }; // Attach game data to wishlist item
            } catch (error) {
              console.error(
                `Error fetching game with ID ${wishItem.gameID}:`,
                error.message
              );
              return { ...wishItem, game: null }; // Handle fetch failure for individual games
            }
          } else {
            return { ...wishItem, game: null }; // Handle invalid gameID
          }
        })
      );

      const filteredWishlist = fetchedWishlist.filter(
        (item) => item.memberID === memberID
      );
      console.log("Filtered wishlist data:", filteredWishlist); // Log filtered data for debugging
      setWishlist(filteredWishlist);
    } catch (error) {
      toast.error("Error fetching wishlist: " + error.message);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  // Function to remove a product from the wishlist via the backend API
  const removeFromWishlist = async (id) => {
    try {
      const memberID = sessionStorage.getItem("userId"); // Retrieve memberID dynamically
      const token = sessionStorage.getItem("token"); // Retrieve token for authentication

      if (!memberID || !token) {
        throw new Error("User is not authenticated");
      }

      console.log(`Attempting to remove wishlist item with ID: ${id}`);
      const response = await fetch(
        `https://localhost:7245/api/WishLists/${id}?memberID=${memberID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Add token for auth
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.message || "Failed to remove product from wishlist"
        );
      }

      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item.wishListID !== id)
      );
      toast.success("Game removed from wishlist!");
    } catch (error) {
      toast.error("Error removing from wishlist: " + error.message);
      console.error("Error removing from wishlist:", error.message); // Log for debugging
    }
  };

  // Function to add a product to the wishlist via the backend API
  const addToWishlist = async (product) => {
    try {
      const memberID = sessionStorage.getItem("userId"); // Retrieve memberID dynamically
      const token = sessionStorage.getItem("token"); // Retrieve token for authentication

      if (!memberID || !token) {
        throw new Error("User is not authenticated");
      }

      console.log("Adding to wishlist: ", product); // Log the product being added

      const payload = {
        gameID: product.id, // Assuming `product.id` is the game's GUID
        memberID: memberID, // Dynamic memberID
        dateAdded: new Date().toISOString(),
      };

      const response = await fetch("https://localhost:7245/api/WishLists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token for auth
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseData = await response.json();
        console.error("Failed to add to wishlist: ", responseData);
        throw new Error(
          responseData.message || "Failed to add product to wishlist"
        );
      }

      const responseData = await response.json();
      setWishlist((prevWishlist) => [
        ...prevWishlist,
        { ...responseData, game: product },
      ]);
      toast.success("Game added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist: ", error.message); // Log the error for debugging
      toast.error("Error adding to wishlist: " + error.message);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
