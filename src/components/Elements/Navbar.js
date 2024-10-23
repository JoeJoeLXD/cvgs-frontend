// src/components/Elements/Navbar.js
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <nav className="bg-gray-100 dark:bg-gray-900 py-4"> {/* Changed dark mode color to a darker gray */}
      <div className="container mx-auto max-w-6xl px-0 flex justify-between items-center">
        {/* Main logo and link */}
        <NavLink to="/" className="text-black dark:text-white font-bold text-lg">
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
            Dashboard
          </NavLink>
          {/* Events Link */}
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
          {/* Preferences Link */}
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
          {/* Profile Link */}
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;




