// src/pages/Order/components/OrderSuccess.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSession } from "../../../services/dataService"; // Adjusted path

const OrderSuccess = ({ data }) => {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = getSession("email"); // Retrieve email from session storage
    setUserEmail(email);
  }, []); // Only run on component mount

  return (
    <section className="text-xl text-center max-w-4xl mx-auto my-10 py-5 dark:text-slate-100 border dark:border-slate-700 rounded">
      <div className="my-5">
        <p className="bi bi-check-circle text-green-600 text-7xl mb-5"></p>
        <p>Thank you {data?.user?.name} for the order!</p>
        <p>Your Order ID: {data?.orderID || "Not Available"}</p> {/* Update here */}
      </div>
      <div className="my-5">
        <p>Your order is confirmed.</p>
        <p>
          Please check your email (<strong>{userEmail}</strong>) for the eBook.
        </p>
      </div>
      <Link
        to="/products"
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-lg px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
      >
        Continue Shopping <i className="ml-2 bi bi-cart"></i>
      </Link>
    </section>
  );
};

export default OrderSuccess;

