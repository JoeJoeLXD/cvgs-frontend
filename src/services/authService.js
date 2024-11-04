// src/services/authService.js 

import { jwtDecode } from 'jwt-decode'; // Corrected import to use named import
import { getUserProfile } from './dataService'; // Import the function to fetch user profile

// Define ClaimTypes if not already imported
const ClaimTypes = {
  NameIdentifier: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  Role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
};

// Function to send a password reset link
export async function forgotPassword({ email }) {
  const response = await fetch('https://localhost:7245/api/Auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  return response;
}

// Function to reset user password
export async function resetPassword({ email, resetCode, newPassword }) {
  const response = await fetch('https://localhost:7245/api/Auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, resetCode, newPassword }),
  });
  return response;
}

// Function to log in a user
export async function login(authDetail) {
  const { email, password } = authDetail;

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  };

  try {
    const response = await fetch(
      "https://localhost:7245/api/Auth/login",
      requestOptions
    );

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.error || response.statusText);
      error.status = response.status;
      throw error;
    }

    const responseData = await response.json();

    // Extract the token from the response
    const token = responseData.token;

    // Decode the JWT token
    const decodedToken = jwtDecode(token); // Correct usage of jwtDecode

    // Prepare the user data
    const userData = {
      accessToken: token,
      user: {
        id: decodedToken[ClaimTypes.NameIdentifier],
        email: decodedToken.sub,
        role: decodedToken[ClaimTypes.Role] || "member",
        displayName: decodedToken.DisplayName || "No name",
      },
    };

    // Store authentication details in session storage
    if (userData.accessToken) {
      sessionStorage.setItem("token", userData.accessToken);
      sessionStorage.setItem("userId", userData.user.id);
      sessionStorage.setItem("email", userData.user.email);
      sessionStorage.setItem("role", userData.user.role);
      sessionStorage.setItem("displayName", userData.user.displayName);
    }

    const userRole = sessionStorage.getItem("role");
    if (userRole && userRole.toLowerCase() !== "admin") {
      // Fetch the latest profile data after login to ensure session storage has updated data
      const updatedProfile = await getUserProfile();
      sessionStorage.setItem("displayName", updatedProfile.displayName);
      sessionStorage.setItem("email", updatedProfile.email);
      sessionStorage.setItem("role", updatedProfile.role);
    }

    // Trigger custom event to signal login
    window.dispatchEvent(new Event("storage"));

    return userData;
  } catch (error) {
    throw error;
  }
}

// Function to register a new user
export async function register(authDetail) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authDetail),
  };

  try {
    const response = await fetch(
      `https://localhost:7245/api/Auth/register`,
      requestOptions
    );

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.error || response.statusText);
      error.status = response.status;
      throw error;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}

// Function to log out the user
export function logout() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("displayName");

  // Trigger custom event to signal logout
  window.dispatchEvent(new Event("storage"));
}

// Utility function to get items from session storage
export function getSession(key) {
  return sessionStorage.getItem(key);
}


