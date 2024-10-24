// src/services/wishlistService.js
import { toast } from 'react-toastify';
import { getSession } from "./dataService";  // Ensure dataService is handling session retrieval properly

/**
 * Fetches the current user's wishlist.
 */
export async function getWishlist() {
  const token = getSession("token");
  const memberID = getSession("userId");

  if (!token || !memberID) {
    toast.error("User is not authenticated");
    throw new Error("User is not authenticated");
  }

  const url = `https://localhost:7245/api/WishLists?memberID=${memberID}`;

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching wishlist: ${errorText}`);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Wishlist fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Error fetching wishlist:", error.message);
    toast.error("Error fetching wishlist");
    throw error;
  }
}

/**
 * Adds a product to the user's wishlist.
 * @param {string} gameID - ID of the product to add.
 */
export async function addToWishlist(gameID) {
  const token = getSession("token");
  const memberID = getSession("userId");

  if (!token || !memberID) {
    toast.error("User is not authenticated");
    throw new Error("User is not authenticated");
  }

  console.log("Adding to wishlist: Member ID:", memberID, "Game ID:", gameID);

  // Payload for adding an item to the wishlist
  const wishlistItem = {
    memberID: String(memberID),  // Ensure memberID is a string
    gameID: gameID,              // Ensure gameID is in GUID format
    dateAdded: new Date().toISOString(),  // ISO format for dateAdded
  };

  console.log("Payload being sent:", JSON.stringify(wishlistItem));

  const url = `https://localhost:7245/api/WishLists`;

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(wishlistItem),
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error adding to wishlist:", errorData);
      throw new Error(`Error ${response.status}: ${errorData.title}`);
    }

    const data = await response.json();
    toast.success("Added to wishlist successfully!");
    console.log("Added to wishlist:", data);
    return data;
  } catch (error) {
    console.error("Error adding to wishlist:", error.message);
    toast.error("Failed to add product to wishlist");
    throw error;
  }
}

/**
 * Removes a product from the user's wishlist.
 * @param {string} wishlistId - ID of the wishlist entry to remove.
 */
export async function removeFromWishlist(wishlistId) {
  const token = getSession("token");

  if (!token) {
    toast.error("User is not authenticated");
    throw new Error("User is not authenticated");
  }

  console.log("Removing wishlist item with ID:", wishlistId);

  const url = `https://localhost:7245/api/WishLists/${wishlistId}`;

  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error removing from wishlist: ${errorText}`);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    toast.success("Removed from wishlist successfully!");
    console.log("Removed from wishlist:", wishlistId);
    return true;
  } catch (error) {
    console.error("Error removing from wishlist:", error.message);
    toast.error("Failed to remove product from wishlist");
    throw error;
  }
}
