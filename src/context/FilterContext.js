//src/context/FilterContext.js
import React, { createContext, useContext, useReducer } from "react";
import { filterReducer } from "../reducers";

// Initial state for the filter context
const filterInitialState = {
  productList: [],
  onlyInStock: false,
  bestSellerOnly: false,
  sortBy: null,
  ratings: null,
};

// Create the context
const FilterContext = createContext(filterInitialState);

// Provider component
export const FilterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, filterInitialState);

  // Function to initialize the product list
  function initialProductList(products) {
    dispatch({
      type: "PRODUCT_LIST",
      payload: {
        products,
      },
    });
  }

  function bestSeller(products) {
    return state.bestSellerOnly
      ? products.filter((product) => product.best_seller === true)
      : products;
  }

  function inStock(products) {
    return state.onlyInStock
      ? products.filter((product) => product.in_stock === true)
      : products;
  }

  function sort(products) {
    if (state.sortBy === "lowtohigh") {
      return products.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (state.sortBy === "hightolow") {
      return products.sort((a, b) => Number(b.price) - Number(a.price));
    }
    return products;
  }

  function rating(products) {
    if (state.ratings === "4STARSABOVE") {
      return products.filter((product) => product.rating >= 4);
    }
    if (state.ratings === "3STARSABOVE") {
      return products.filter((product) => product.rating >= 3);
    }
    if (state.ratings === "2STARSABOVE") {
      return products.filter((product) => product.rating >= 2);
    }
    if (state.ratings === "1STARSABOVE") {
      return products.filter((product) => product.rating >= 1);
    }
    return products;
  }

  const filteredProductList = rating(
    sort(inStock(bestSeller(state.productList)))
  );

  const value = {
    state,
    dispatch,
    products: filteredProductList,
    initialProductList,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

// Custom hook to use the filter context
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
