// src/services/wishlistService.js

import { getSession } from "./dataService";

/**
 * Fetches the current user's wishlist.
 */
export async function getWishlist() {
  const token = getSession("token");
  const userId = getSession("cbid");

  if (!token || !userId) {
    throw new Error("User is not authenticated");
  }

  const url = `http://localhost:8000/wishlists?userId=${userId}`;

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
}

/**
 * Adds a product to the user's wishlist.
 * @param {number} productId - ID of the product to add.
 */
export async function addToWishlist(productId) {
  const token = getSession("token");
  const userId = getSession("cbid");

  if (!token || !userId) {
    throw new Error("User is not authenticated");
  }

  // Check if the product is already in the wishlist
  const existingWishlist = await fetch(`http://localhost:8000/wishlists?userId=${userId}&productId=${productId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json());

  if (existingWishlist.length > 0) {
    throw new Error("Product is already in your wishlist.");
  }

  const wishlistItem = {
    userId: Number(userId),
    productId: Number(productId),
    addedAt: new Date().toISOString(),
  };

  const url = `http://localhost:8000/wishlists`;

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
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
}

/**
 * Removes a product from the user's wishlist.
 * @param {number} wishlistId - ID of the wishlist entry to remove.
 */
export async function removeFromWishlist(wishlistId) {
  const token = getSession("token");

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const url = `http://localhost:8000/wishlists/${wishlistId}`;

  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
}
