//src/context/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { cartReducer } from "../reducers";

// Get cart from localStorage or initialize with an empty cart
const cartInitialState = {
  cartList: JSON.parse(localStorage.getItem("cartList")) || [],
  total: JSON.parse(localStorage.getItem("total")) || 0,
};

const CartContext = createContext(cartInitialState);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);

  // Save the cart to localStorage whenever the cartList or total is updated
  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(state.cartList));
    localStorage.setItem("total", JSON.stringify(state.total));
  }, [state.cartList, state.total]);

  function addToCart(product) {
    const updatedList = state.cartList.concat(product);
    const updatedTotal = state.total + product.price;

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        products: updatedList,
        total: updatedTotal,
      },
    });
  }

  function removeFromCart(product) {
    const updatedList = state.cartList.filter((item) => item.id !== product.id);
    const updatedTotal = state.total - product.price;

    dispatch({
      type: "REMOVE_FROM_CART",
      payload: {
        products: updatedList,
        total: updatedTotal,
      },
    });
  }

  function clearCart() {
    dispatch({
      type: "CLEAR_CART",
      payload: {
        products: [],
        total: 0,
      },
    });
  }

  const value = {
    cartList: state.cartList,
    total: state.total,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  return context;
};
