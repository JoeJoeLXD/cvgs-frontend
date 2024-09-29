// src/services/authService.js

// Simulated function to reset user password
export async function resetPassword(email) {
  // Simulate an async delay, like a real API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "user@example.com") {
        resolve({ message: "Password reset email sent" });
      } else {
        reject(new Error("Email not found"));
      }
    }, 1000); // Simulate 1 second delay
  });
}

// Function to log in a user
export async function login(authDetail) {
  const { email, password } = authDetail;

  // Temporary hardcoded admin credentials for testing
  const hardcodedAdmin = {
    email: "admin@example.com",
    password: "admin123",
    role: "admin", // Set the role as 'admin'
  };

  // Check if the credentials match the hardcoded admin
  if (email === hardcodedAdmin.email && password === hardcodedAdmin.password) {
    // Create a simulated response data for admin
    const data = {
      accessToken: "adminToken123", // Simulated token
      user: {
        id: "1", // Simulated user ID
        email: hardcodedAdmin.email,
        role: hardcodedAdmin.role,
      },
    };

    // Store the admin user details in session storage
    sessionStorage.setItem("token", data.accessToken);
    sessionStorage.setItem("cbid", data.user.id);
    sessionStorage.setItem("email", data.user.email);
    sessionStorage.setItem("role", data.user.role);

    return data; // Return the simulated data
  } else {
    // Proceed with the regular login for other users via backend API
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authDetail),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/login`,
        requestOptions
      );

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.error || response.statusText);
        error.status = response.status;
        throw error;
      }

      const data = await response.json();

      console.log(data);

      // Store authentication details in session storage
      if (data.accessToken) {
        sessionStorage.setItem("token", data.accessToken); // Store token as string
        sessionStorage.setItem("cbid", data.user.id); // Store user ID as string
        sessionStorage.setItem("email", data.user.email); // Store user email as string
        sessionStorage.setItem("role", data.user.role || "user"); // Store user role (default to 'user')
      }

      return data;
    } catch (error) {
      throw error;
    }
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
      `${process.env.REACT_APP_HOST}/register`,
      requestOptions
    );

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.error || response.statusText);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();

    console.log(data);

    // Storing authentication details in session storage
    if (data.accessToken) {
      sessionStorage.setItem("token", data.accessToken); // Store token as string
      sessionStorage.setItem("cbid", data.user.id); // Store user ID as string
      sessionStorage.setItem("email", data.user.email); // Store user email as string
      sessionStorage.setItem("role", data.user.role); // Store user role (admin or user)
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Function to log out the user
export function logout() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("cbid");
  sessionStorage.removeItem("email"); // Clear user email from session
  sessionStorage.removeItem("role"); // Clear user role from session
}

// Utility function to get items from session storage
export function getSession(key) {
  return sessionStorage.getItem(key); // Retrieve item as string
}
