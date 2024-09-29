// src/components/Admin/AdminPanel.js
import React from "react";
import { Outlet } from "react-router-dom";
import AdminPanelNav from "./AdminPanelNav";

const AdminPanel = () => {
  return (
    <div>
      <AdminPanelNav /> {/* This renders the navigation only once */}
      <div className="p-4">
        <Outlet /> {/* Renders each admin page inside */}
      </div>
    </div>
  );
};

export default AdminPanel;



