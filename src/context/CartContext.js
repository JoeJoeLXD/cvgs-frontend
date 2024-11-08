//src/context/CartContext.js
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import { cartReducer } from "../reducers";

// Function to get cart data from localStorage for a specific member
function getCartData(memberID) {
  return {
    cartList: JSON.parse(localStorage.getItem(`${memberID}_cartList`)) || [],
    total: JSON.parse(localStorage.getItem(`${memberID}_total`)) || 0,
  };
}

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [memberID, setMemberID] = useState(sessionStorage.getItem("userId"));

  // Initial cart state based on memberID
  const [state, dispatch] = useReducer(
    cartReducer,
    memberID ? getCartData(memberID) : { cartList: [], total: 0 }
  );

  // Function to re-retrieve memberID and re-initialize the cart
  const refreshCart = () => {
    const currentMemberID = sessionStorage.getItem("userId");
    setMemberID(currentMemberID);

    if (currentMemberID) {
      const newCartData = getCartData(currentMemberID);
      dispatch({
        type: "INIT_CART",
        payload: {
          products: newCartData.cartList,
          total: newCartData.total,
        },
      });
    } else {
      // Clear cart state if no memberID is found
      dispatch({
        type: "INIT_CART",
        payload: {
          products: [],
          total: 0,
        },
      });
    }
  };

  // Save the cart to localStorage whenever the cartList or total is updated
  useEffect(() => {
    if (memberID) {
      localStorage.setItem(
        `${memberID}_cartList`,
        JSON.stringify(state.cartList)
      );
      localStorage.setItem(`${memberID}_total`, JSON.stringify(state.total));
    }
  }, [state.cartList, state.total, memberID]);

  function addToCart(product) {
    const productExists = state.cartList.find((item) => item.id === product.id);
    if (productExists) {
      console.log("Product is already in the cart.");
      return;
    }

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
    refreshCart, // Expose the refreshCart function
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  return context;
};
