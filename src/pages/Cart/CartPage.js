// src/pages/Cart/CartPage.js
import useTitle from "../../hooks/useTitle";
import React from "react";
import CartEmpty from "./components/CartEmpty";
import CartList from "./components/CartList";
import { useCart } from "../../context";

const CartPage = () => {
  const { cartList } = useCart();
  useTitle(`Cart (${cartList.length})`);

  return (
    <main className="container mx-auto max-w-6xl px-0 py-4 dark:bg-gray-800">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Shopping Cart</h1>
      {cartList.length ? (
        <CartList />
      ) : (
        <CartEmpty message="Your cart is empty! Start exploring our store." />
      )}
    </main>
  );
};

export default CartPage;

