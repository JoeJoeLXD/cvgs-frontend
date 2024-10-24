// src/services/dataService.js 
import { toast } from "react-toastify";

// Update user profile
export async function updateUser(userId, updatedProfile) {
  const token = getSession("token");

  if (!token || !userId) {
    toast.error("User is not authenticated or missing userId");
    throw new Error("User is not authenticated or missing userId");
  }

  const url = `https://localhost:7245/api/UserProfiles/${userId}`;

  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...updatedProfile,
      userId, // Ensure the userId is explicitly included in the payload
    }),
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      toast.error(`Error ${response.status}: ${errorText}`);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    toast.success("Profile updated successfully!");
    return data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    toast.error("Error updating profile.");
    throw error;
  }
}

// Utility function to get session storage items
export function getSession(key) {
  return sessionStorage.getItem(key); // Retrieve item as string
}

// Fetch user details
export async function getUserProfile() {
  const token = getSession("token");
  const userId = getSession("userId");

  if (!token || !userId) {
    toast.error("User is not authenticated");
    throw new Error("User is not authenticated");
  }

  const url = `https://localhost:7245/api/UserProfiles/${userId}`; // Endpoint to get user profile

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      toast.error(`Error ${response.status}: ${errorText}`);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    toast.error("Error fetching user profile.");
    throw error;
  }
}

// Fetch the user's orders
export async function getUserOrders() {
  const token = getSession("token");
  const userId = getSession("userId");

  if (!token || !userId) {
    toast.error("User is not authenticated");
    throw new Error("User is not authenticated");
  }

  const url = `https://localhost:7245/api/orders`;

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
      toast.error(`Error ${response.status}: ${errorText}`);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const orders = data.filter((order) => order.user.id === Number(userId));
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    toast.error("Error fetching orders.");
    throw error;
  }
}

// Create a new order
export async function createOrder(orderData) {
  const token = getSession("token");

  if (!token) {
    toast.error("User is not authenticated");
    throw new Error("User is not authenticated");
  }

  const url = `https://localhost:7245/api/orders`;

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      toast.error(`Error ${response.status}: ${errorText}`);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    toast.success("Order created successfully!");
    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    toast.error("Error creating order.");
    throw error;
  }
}

// Save Address Function
export async function saveAddress(addressData) {
  const token = getSession("token");
  const memberID = getSession("userId");

  if (!token || !memberID) {
    toast.error("User is not authenticated");
    throw new Error("User is not authenticated");
  }

  const url = `https://localhost:7245/api/Addresses`;

  const bodyData = {
    ...addressData,
    memberID: memberID, // Include memberID to associate the address with the user profile
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bodyData),
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      toast.error(`Error ${response.status}: ${errorText}`);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    toast.success("Address saved successfully!");
    return data;
  } catch (error) {
    console.error("Error saving address:", error);
    toast.error("Error saving address.");
    throw error;
  }
}
