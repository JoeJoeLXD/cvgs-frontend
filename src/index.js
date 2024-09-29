// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FilterProvider, CartProvider, WishlistProvider } from "./context";
import { FriendsAndFamilyProvider } from "./context/FriendsAndFamilyContext";
import { PreferencesProvider } from "./context/PreferencesContext"; // Add PreferencesProvider
import { ScrollToTop } from "./components";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <WishlistProvider>
        <CartProvider>
          <FilterProvider>
            <FriendsAndFamilyProvider>
              <PreferencesProvider>
                <ScrollToTop />
                <ToastContainer
                  closeButton={false}
                  autoClose={3000}
                  position={"bottom-right"}
                />
                <App />
              </PreferencesProvider>
            </FriendsAndFamilyProvider>
          </FilterProvider>
        </CartProvider>
      </WishlistProvider>
    </Router>
  </React.StrictMode>
);
