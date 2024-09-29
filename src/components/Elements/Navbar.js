// src/components/Elements/Navbar.js

import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-lg">
          GameHub
        </Link>
        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="text-white lg:hidden"
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className={`${navbarOpen ? "block" : "hidden"} lg:flex lg:items-center`}>
          <Link to="/products" className="text-white px-3 py-2 hover:bg-gray-700 rounded">
            Products
          </Link>
          <Link to="/wishlist" className="text-white px-3 py-2 hover:bg-gray-700 rounded">
            Wishlist
          </Link>
          <Link to="/dashboard" className="text-white px-3 py-2 hover:bg-gray-700 rounded">
            Dashboard
          </Link>
          {/* Added Events Link */}
          <Link to="/events" className="text-white px-3 py-2 hover:bg-gray-700 rounded">
            Events
          </Link>
          {/* Added Preferences Link */}
          <Link to="/preferences" className="text-white px-3 py-2 hover:bg-gray-700 rounded">
            Preferences
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
