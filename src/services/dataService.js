// src/services/dataService.js 

// Update user profile
export async function updateUser(userId, updatedProfile) {
  const token = getSession("token");

  if (!token || !userId) {
    throw new Error("User is not authenticated or missing userId");
  }

  const url = `http://localhost:8000/users/${userId}`;

  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedProfile),
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
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// Utility function to get session storage items
export function getSession(key) {
  return sessionStorage.getItem(key); // Retrieve item as string
}

// Fetch user details
export async function getUser() {
  const token = getSession("token");
  const cbid = getSession("cbid");
  //const userRole = getSession("role");

  if (!token || !cbid) {
    throw new Error("User is not authenticated");
  }

  const url = `http://localhost:8000/users`; // JSON Server endpoint

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
    const user = data.find((user) => user.id === Number(cbid));
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

// Fetch the user's orders
export async function getUserOrders() {
  const token = getSession("token");
  const cbid = getSession("cbid");

  if (!token || !cbid) {
    throw new Error("User is not authenticated");
  }

  const url = `http://localhost:8000/orders`; // JSON Server endpoint

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
    const orders = data.filter((order) => order.user.id === Number(cbid));
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
}

// Create a new order
export async function createOrder(orderData) { // Modified to accept orderData
  const token = getSession("token");

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const url = `http://localhost:8000/orders`; // JSON Server endpoint

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
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// Save Address Function
export async function saveAddress(addressData) {
  const token = getSession("token");
  const cbid = getSession("cbid"); // Assuming 'cbid' is the user ID

  if (!token || !cbid) {
    throw new Error("User is not authenticated");
  }

  const url = `http://localhost:8000/userAddresses`; // JSON Server endpoint for addresses

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // If your JSON server handles auth
    },
    body: JSON.stringify({
      ...addressData,
      userId: Number(cbid), // Associate address with user
    }),
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
    console.error("Error saving address:", error);
    throw error;
  }
}


