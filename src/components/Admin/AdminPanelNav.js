// src/components/Admin/AdminPanelNav.js
import React from "react";
import { NavLink } from "react-router-dom";

const AdminPanelNav = () => {
  return (
    <nav className="bg-gray-800 text-white py-4">
      <ul className="flex justify-around">
        <li>
          <NavLink
            to="/admin/games"  // Absolute path
            className={({ isActive }) =>
              isActive
                ? "text-yellow-300 font-bold"
                : "text-white hover:text-yellow-300"
            }
          >
            Manage Games
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/events"  // Absolute path
            className={({ isActive }) =>
              isActive
                ? "text-yellow-300 font-bold"
                : "text-white hover:text-yellow-300"
            }
          >
            Manage Events
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/reports"  // Absolute path
            className={({ isActive }) =>
              isActive
                ? "text-yellow-300 font-bold"
                : "text-white hover:text-yellow-300"
            }
          >
            View Reports
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/reviews"  // Absolute path
            className={({ isActive }) =>
              isActive
                ? "text-yellow-300 font-bold"
                : "text-white hover:text-yellow-300"
            }
          >
            Review Games
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdminPanelNav;



