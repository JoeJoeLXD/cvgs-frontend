// src/components/Elements/DropdownLoggedIn.js

import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession, logout } from "../../services/authService";

const DropdownLoggedIn = ({ setDropdown }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    role: "member",
    displayName: "",
  });

  const handleLogout = useCallback(() => {
    logout();
    setDropdown(false);
    navigate("/");
  }, [navigate, setDropdown]);

  useEffect(() => {
    const email = getSession("email");
    const role = getSession("role");
    const displayName = getSession("displayName");

    if (email && role) {
      setUser({ email, role, displayName });
    } else {
      handleLogout();
    }
  }, [handleLogout]);

  // Handler for the Edit Profile link, navigate to the profile page and trigger a refresh
  const handleEditProfileClick = () => {
    // Optionally, you can clear the dropdown when navigating
    setDropdown(false);

    // Navigate to the profile page, and React Router will handle the rest (fetch new profile info)
    navigate("/profile");
  };

  return (
    <div
      id="dropdownAvatar"
      className="select-none absolute top-10 right-0 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
    >
      <div className="py-3 px-4 text-sm text-gray-900 dark:text-white">
        <div className="font-medium truncate">{user.displayName}</div>
      </div>
      <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
        {user.role.toLowerCase() !== "admin" && (
          <>
            <li>
              <Link
                onClick={() => setDropdown(false)}
                to="/products"
                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Games
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setDropdown(false)}
                to="/dashboard"
                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Orders
              </Link>
            </li>
            <li>
              {/* Update this link to handle fetching new profile info */}
              <span
                onClick={handleEditProfileClick}
                className="block cursor-pointer py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Profile
              </span>
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
