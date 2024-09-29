// src/pages/Cart/components/Checkout.js

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart, useWishlist } from "../../../context";
import { createOrder, getUser, saveAddress } from "../../../services";
import AddressForm from "../../../components/Elements/AddressForm";

const Checkout = ({ setCheckout }) => {
  const { cartList, total, clearCart } = useCart();
  const { wishlist } = useWishlist();
  const [user, setUser] = useState({});
  const [address, setAddress] = useState(null);
  const [isAddressSubmitted, setIsAddressSubmitted] = useState(false);
  const [selectedCard, setSelectedCard] = useState("");
  const navigate = useNavigate();

  const modalContentRef = useRef(null);

  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0; // Scroll modal to top
    }

    async function fetchData() {
      try {
        const data = await getUser();
        setUser(data);
      } catch (error) {
        toast.error(error.message, { closeButton: true, position: "bottom-center" });
      }
    }
    fetchData();
  }, []);

  const handleOrderSubmit = async (event) => {
    event.preventDefault();

    if (!isAddressSubmitted || !address || Object.keys(address).length === 0) {
      toast.error("Please complete your delivery address before proceeding.", {
        closeButton: true,
        position: "bottom-center",
      });
      return;
    }

    if (!selectedCard) {
      toast.error("Please select a payment method before proceeding.", {
        closeButton: true,
        position: "bottom-center",
      });
      return;
    }

    try {
      const orderData = {
        cartList,
        total,
        user,
        address,
        wishlist,
        status: "Pending", // Initial order status set to Pending
      };
      const data = await createOrder(orderData);
      clearCart();
      navigate("/order-summary", { state: { data: data, status: true } });
    } catch (error) {
      toast.error(error.message, { closeButton: true, position: "bottom-center" });
      navigate("/order-summary", { state: { status: false } });
    }
  };

  const handleAddressSubmit = async (addressData) => {
    try {
      const savedAddress = await saveAddress(addressData);
      setAddress(savedAddress);
      setIsAddressSubmitted(true);
      toast.success("Address saved successfully.", { closeButton: true, position: "bottom-center" });
    } catch (error) {
      toast.error("Failed to save address.", { closeButton: true, position: "bottom-center" });
    }
  };

  const handleSelectCard = (event) => {
    setSelectedCard(event.target.value);
  };

  return (
    <section>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

      <div
        id="checkout-modal"
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
        aria-modal="true"
        role="dialog"
      >
        <div ref={modalContentRef} className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700 max-h-screen w-full max-w-2xl p-4 overflow-y-auto">
          <button
            onClick={() => setCheckout(false)}
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="Close modal"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>

          <div className="py-6 px-6 lg:px-8">
            <div className="mb-6">
              <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                <i className="bi bi-geo-alt mr-2"></i>Delivery Address
              </h3>
              <AddressForm onSubmit={handleAddressSubmit} />
            </div>

            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              <i className="bi bi-credit-card mr-2"></i>Card Payment
            </h3>

            <form onSubmit={handleOrderSubmit} className="space-y-6">
              <div>
                <label htmlFor="cardSelect" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Select Card for Payment:
                </label>
                <select
                  id="cardSelect"
                  name="cardSelect"
                  onChange={handleSelectCard}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  required
                >
                  <option value="">-- Select a Card --</option>
                  <option value="4215625462597845">**** 7845</option>
                  <option value="1234567812345678">**** 5678</option>
                </select>
              </div>

              <p className="mb-4 text-2xl font-semibold text-lime-500 text-center">
                ${total}
              </p>

              <button
                type="submit"
                className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                  isAddressSubmitted ? "bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isAddressSubmitted}
              >
                <i className="mr-2 bi bi-lock-fill"></i>PAY NOW
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;

