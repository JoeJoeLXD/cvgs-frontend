// src/pages/Cart/CartPage.js
import useTitle from "../../hooks/useTitle"; // Fix the typo in the import statement
import React from "react";
import CartEmpty from "./components/CartEmpty"; // Use default import
import CartList from "./components/CartList";   // Use default import
import { useCart } from "../../context"; 


const CartPage = () => {
  const { cartList } = useCart();
  useTitle(`Cart (${cartList.length})`);
  

  return (
    <main>
      { cartList.length ? <CartList /> : <CartEmpty /> }  
    </main>
  );
};

export default CartPage;
