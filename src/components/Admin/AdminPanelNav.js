// src/components/Admin/AdminPanelNav.js

import React from "react";
import { NavLink } from "react-router-dom";

const AdminPanelNav = () => {
  return (
    <nav className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white py-6">
      <div className="container mx-auto px-0">
        <ul className="flex justify-around">
          <li>
            <NavLink
              to="/admin/games"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500 dark:text-blue-400 font-bold tracking-wide"
                  : "text-black dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 hover:px-6 hover:py-3 rounded transition"
              }
            >
              Manage Games
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/events"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500 dark:text-blue-400 font-bold tracking-wide"
                  : "text-black dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 hover:px-6 hover:py-3 rounded transition"
              }
            >
              Manage Events
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/reports"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500 dark:text-blue-400 font-bold tracking-wide"
                  : "text-black dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 hover:px-6 hover:py-3 rounded transition"
              }
            >
              View Reports
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/reviews"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500 dark:text-blue-400 font-bold tracking-wide"
                  : "text-black dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 hover:px-6 hover:py-3 rounded transition"
              }
            >
              Review Games
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminPanelNav;


