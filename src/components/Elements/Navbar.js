// src/components/Elements/Navbar.js

import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <nav className="bg-gray-100 py-4">
      <div className="container mx-auto max-w-6xl px-0 flex justify-between items-center">
        {/* Main logo and link */}
        <NavLink to="/" className="text-black font-bold text-lg">
          GameHub
        </NavLink>

        {/* Mobile toggle button */}
        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="text-white lg:hidden"
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
                ? "text-blue-500 font-bold px-4 py-2 hover:bg-gray-300 rounded"
                : "text-black px-4 py-2 hover:bg-gray-300 rounded"
            }
          >
            Games
          </NavLink>
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 font-bold px-4 py-2 hover:bg-gray-300 rounded"
                : "text-black px-4 py-2 hover:bg-gray-300 rounded"
            }
          >
            Wishlist
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 font-bold px-4 py-2 hover:bg-gray-300 rounded"
                : "text-black px-4 py-2 hover:bg-gray-300 rounded"
            }
          >
            Dashboard
          </NavLink>
          {/* Events Link */}
          <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 font-bold px-4 py-2 hover:bg-gray-300 rounded"
                : "text-black px-4 py-2 hover:bg-gray-300 rounded"
            }
          >
            Events
          </NavLink>
          {/* Preferences Link */}
          <NavLink
            to="/preferences"
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 font-bold px-4 py-2 hover:bg-gray-300 rounded"
                : "text-black px-4 py-2 hover:bg-gray-300 rounded"
            }
          >
            Preferences
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

