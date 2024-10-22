import { jwtDecode } from 'jwt-decode'; // Correct import statement

// Define ClaimTypes if not already imported
const ClaimTypes = {
  NameIdentifier: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  Role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
};

// Simulated function to reset user password
export async function resetPassword(email) {
  // Simulate an async delay, like a real API call
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     if (email === "user@example.com") {
  //       resolve({ message: "Password reset email sent" });
  //     } else {
  //       reject(new Error("Email not found"));
  //     }
  //   }, 1000); // Simulate 1 second delay
  // });
    const response = await fetch('https://localhost:7245/api/Auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  return response;
      
};


export async function login(authDetail) {
  const { email, password } = authDetail;

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }), // Send email and password
  };

  try {
    const response = await fetch(
      "https://localhost:7245/api/Auth/login", // New API endpoint
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
    const decodedToken = jwtDecode(token);

    // Prepare the user data
    const userData = {
      accessToken: token, // Store the JWT token
      user: {
        id: decodedToken[ClaimTypes.NameIdentifier], // Get user ID from the decoded token
        email: decodedToken.sub, // Get email from the decoded token
        role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "member", // Get role from the decoded token
        displayName: decodedToken.DisplayName || "No name", // Get display name from the decoded token
      },
    };

    // Store authentication details in session storage
    if (userData.accessToken) {
      sessionStorage.setItem("token", userData.accessToken); // Store token as string
      sessionStorage.setItem("userId", userData.user.id); // Store user ID as string
      sessionStorage.setItem("email", userData.user.email); // Store user email as string
      sessionStorage.setItem("role", userData.user.role); // Store user role
      sessionStorage.setItem("displayName", userData.user.displayName); // Store display name
    }

    return userData; // Return user data
  } catch (error) {
    throw error; // Propagate the error
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

//     // Extract the token from the response
//     const token = responseData.token;
// console.log('token:'+token);
//     // Decode the JWT token
//     const decodedToken = jwtDecode(token);


//     // Prepare the user data
//     const userData = {
//       accessToken: token, // Store the JWT token
//       user: {
//         id: decodedToken[ClaimTypes.NameIdentifier], // Get user ID from the decoded token
//         email: decodedToken.sub, // Get email from the decoded token
//         role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "member", // Get role from the decoded token
//         displayName: decodedToken.DisplayName || "No name", // Get display name from the decoded token
//       },
//     };

//     // Store authentication details in session storage
//     if (userData.accessToken) {
//       sessionStorage.setItem("token", userData.accessToken); // Store token as string
//       sessionStorage.setItem("userId", userData.user.id); // Store user ID as string
//       sessionStorage.setItem("email", userData.user.email); // Store user email as string
//       sessionStorage.setItem("role", userData.user.role); // Store user role
//       sessionStorage.setItem("displayName", userData.user.displayName); // Store display name
//     }

    return responseData; // Return response data
  } catch (error) {
    throw error; // Propagate the error
  }
}

// Function to log out the user
export function logout() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("email"); // Clear user email from session
  sessionStorage.removeItem("role"); // Clear user role from session
  sessionStorage.removeItem("displayName"); // Clear user role from session
}

// Utility function to get items from session storage
export function getSession(key) {
  return sessionStorage.getItem(key); // Retrieve item as string
}
