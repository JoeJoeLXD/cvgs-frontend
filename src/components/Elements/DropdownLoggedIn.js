// src/components/Elements/DropdownLoggedIn.js

import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession, logout } from "../../services/authService"; // Updated to use getSession from authService

const DropdownLoggedIn = ({ setDropdown }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    role: "member", // Default to "member"
    displayName: "User", // Default to "User"
  });

  const handleLogout = useCallback(() => {
    logout();
    setDropdown(false);
    navigate("/");
  }, [navigate, setDropdown]);

  // Fetch user info from session storage
  useEffect(() => {
    const email = getSession("email");
    const role = getSession("role");
    const displayName = getSession("displayName") || "User"; // Fetch displayName with fallback

    // If email, role, and displayName are found in session storage, set the user state
    if (email && role) {
      setUser({ email, role, displayName });
    } else {
      // Handle the case where the user is not logged in or data is missing
      handleLogout(); // Log out if no valid session is found
    }
  }, [handleLogout]);

  return (
    <div
      id="dropdownAvatar"
      className="select-none absolute top-10 right-0 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
    >
      <div className="py-3 px-4 text-sm text-gray-900 dark:text-white">
        <div className="font-medium truncate">
          {user.role.toLowerCase() === "admin" ? "Admin" : user.displayName}
        </div>
      </div>
      <ul
        className="py-1 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownUserAvatarButton"
      >
        {/* Show links only for non-admin users */}
        {user.role.toLowerCase() !== "admin" && (
          <>
            <li>
              <Link
                onClick={() => setDropdown(false)}
                to="/products"
                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                All Games
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setDropdown(false)}
                to="/dashboard"
                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setDropdown(false)}
                to="/profile"
                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Edit Profile
              </Link>
            </li>
          </>
        )}
      </ul>
      <div className="py-1">
        <span
          onClick={handleLogout}
          className="cursor-pointer block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
        >
          Log out
        </span>
      </div>
    </div>
  );
};

export default DropdownLoggedIn;
