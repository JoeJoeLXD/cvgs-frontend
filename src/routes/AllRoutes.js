// src/routes/AllRoutes.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  HomePage,
  ProductsList,
  ProductDetail,
  Login,
  PageNotFound,
  Register,
  CartPage,
  DashboardPage,
  OrderPage,
  AdminGames,
  AdminEvents,
  AdminReports,
  AdminReviews,
  Profile,
  Wishlist,
  EventsPage,
  PreferencesPage,
  SubmitReviewPage,
  FriendsAndFamily, 
} from "../pages";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminPanel } from "../components";

export const AllRoutes = ({ setUserEmail }) => {
  return (
    <Routes>
      {/* Preferences Route */}
      <Route
        path="preferences"
        element={
          <ProtectedRoute>
            <PreferencesPage />
          </ProtectedRoute>
        }
      />

      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="products" element={<ProductsList />} />
      <Route path="products/:id" element={<ProductDetail />} />
      <Route path="login" element={<Login setUserEmail={setUserEmail} />} />
      <Route path="register" element={<Register />} />

      {/* Events Route */}
      <Route path="events" element={<EventsPage />} />

      {/* Protected Routes */}
      <Route
        path="cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="order-summary"
        element={
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />

      <Route
        path="submit-review"
        element={
          <ProtectedRoute>
            <SubmitReviewPage />
          </ProtectedRoute>
        }
      />

      {/* Friends and Family Route */}
      <Route
        path="friends-and-family"
        element={
          <ProtectedRoute>
            <FriendsAndFamily />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="admin/*"
        element={
          <ProtectedRoute isAdmin={true}>
            <AdminPanel /> {/* AdminPanel includes the AdminPanelNav and the Outlet for nested routes */}
          </ProtectedRoute>
        }
      >
        {/* Define all the nested routes under the AdminPanel */}
        <Route path="games" element={<AdminGames />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route index element={<Navigate to="games" replace />} />
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


