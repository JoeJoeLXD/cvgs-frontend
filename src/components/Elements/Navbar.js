// src/components/Elements/Navbar.js
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getSession } from "../../services/dataService";

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [userRole, setUserRole] = useState(getSession("role"));

  useEffect(() => {
    const handleStorageChange = () => {
      // Update user role if session storage changes
      setUserRole(getSession("role"));
    };

    // Listen for storage changes (e.g., login/logout updates)
    window.addEventListener("storage", handleStorageChange);

    // Clean up event listener when component unmounts
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isAdmin = userRole && userRole.toLowerCase() === "admin";

  return (
    <nav className="bg-gray-100 dark:bg-gray-900 py-4">
      <div className="container mx-auto max-w-6xl px-6 flex justify-between items-center">
        {/* Main logo and link */}
        <NavLink
          to="/"
          className="text-black dark:text-white font-bold text-lg"
        >
          GameHub
        </NavLink>

        {/* Mobile toggle button */}
        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="text-black dark:text-white lg:hidden"
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Navbar links */}
        <div
          className={`${
            navbarOpen ? "block" : "hidden"
          } lg:flex lg:items-center space-x-4`}
        >
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 font-bold px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                : "text-black dark:text-white px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
            }
          >
            Games
          </NavLink>

          {!isAdmin && (
            <>
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-bold px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                    : "text-black dark:text-white px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                }
              >
                Wishlist
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-bold px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                    : "text-black dark:text-white px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                }
              >
                Orders
              </NavLink>
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-bold px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                    : "text-black dark:text-white px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                }
              >
                Events
              </NavLink>
              <NavLink
                to="/preferences"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-bold px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                    : "text-black dark:text-white px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                }
              >
                Preferences
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-bold px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                    : "text-black dark:text-white px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                }
              >
                Profile
              </NavLink>
              <NavLink
                to="/friends-and-family"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-bold px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                    : "text-black dark:text-white px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                }
              >
                Friends & Family
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
