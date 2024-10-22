// src/components/Layouts/Header.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import Search from "../Sections/Search";
import { DropdownLoggedOut, DropdownLoggedIn } from "../index";
import { useCart } from "../../context";
import { getSession } from "../../services/dataService";

const Header = () => {
  const { cartList } = useCart();
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );
  const [searchSection, setSearchSection] = useState(false); // Re-added
  const [dropdown, setDropdown] = useState(false); // Re-added

  // Get the token, email, and role from sessionStorage
  const [token, setToken] = useState(getSession("token"));
  const [userEmail, setUserEmail] = useState(getSession("email"));
  const [userRole, setUserRole] = useState(getSession("role"));
  const [displayName, setDisplayName] = useState(getSession("displayName"));

  // Sync darkMode preference with localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Update token, userEmail, and userRole whenever the dropdown is toggled
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setToken(getSession("token"));
    setUserEmail(getSession("email"));
    setUserRole(getSession("role"));
    setDisplayName(getSession("displayName"));
  });

  return (
    <header className="bg-white dark:bg-gray-900 shadow">
      <nav className="container mx-auto max-w-6xl px-0 flex justify-between items-center py-3">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} className="h-10 w-10 mr-3" alt="Team Logo" />
            <span className="text-2xl font-semibold dark:text-white">
              CVGS Team GameHub
            </span>
          </Link>
        </div>

        {/* Welcome Message */}
        {token && displayName && (
          <div className="text-gray-700 dark:text-white">
            Welcome, {displayName}({userEmail})
          </div>
        )}

        <div className="flex items-center space-x-6">
          {/* Dark/Light Mode Toggle */}
          <div className="relative group">
            <span
              onClick={() => setDarkMode(!darkMode)}
              className="cursor-pointer text-xl text-gray-700 dark:text-white"
            >
              {darkMode ? (
                <i className="bi bi-sun-fill"></i> // Light mode icon
              ) : (
                <i className="bi bi-moon-fill"></i> // Dark mode icon
              )}
            </span>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 px-3 py-1 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              {darkMode ? "Light" : "Dark"}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-3 h-3 bg-black rotate-45"></div>
            </div>
          </div>

          {/* Search Icon */}
          <div className="relative group">
            <span
              onClick={() => setSearchSection(!searchSection)} // Re-added toggle for search
              className="cursor-pointer text-xl text-gray-700 dark:text-white"
            >
              <i className="bi bi-search"></i>
            </span>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 px-3 py-1 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Search
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-3 h-3 bg-black rotate-45"></div>
            </div>
          </div>

          {/* Cart Icon */}
          <div className="relative group">
            <Link to="/cart" className="relative text-gray-700 dark:text-white">
              <span className="text-2xl bi bi-cart-fill">
                <span className="absolute text-white text-sm -top-2 left-2.5 bg-rose-500 px-1 rounded-full">
                  {cartList.length}
                </span>
              </span>
            </Link>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 px-3 py-1 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Cart
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-3 h-3 bg-black rotate-45"></div>
            </div>
          </div>

          {/* Profile Icon */}
          <div className="relative group">
            <span
              onClick={() => setDropdown(!dropdown)} // Re-added dropdown toggle
              className="bi bi-person-circle cursor-pointer text-2xl text-gray-700 dark:text-white"
            ></span>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 px-3 py-1 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Profile
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-3 h-3 bg-black rotate-45"></div>
            </div>
            {dropdown &&
              (token ? (
                <DropdownLoggedIn setDropdown={setDropdown} /> // Re-added
              ) : (
                <DropdownLoggedOut setDropdown={setDropdown} /> // Re-added
              ))}
          </div>

          {/* Admin Icon - Only for Admin Users */}
          {userRole != null && userRole.toLowerCase() === "admin" && (
            <div className="relative group">
              <Link
                to="/admin"
                className="cursor-pointer text-xl text-gray-700 dark:text-white"
              >
                <i className="bi bi-gear-fill"></i>
              </Link>
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 px-3 py-1 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Admin
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-3 h-3 bg-black rotate-45"></div>
              </div>
            </div>
          )}
        </div>
      </nav>
      {searchSection && <Search setSearchSection={setSearchSection} />} {/* Search section is now re-added */}
    </header>
  );
};

export default Header;
