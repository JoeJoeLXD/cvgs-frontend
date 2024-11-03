// src/pages/Cart/components/Checkout.js

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../../context";
import { createOrder, saveAddress, getSession } from "../../../services";
import AddressForm from "../../../components/Elements/AddressForm";
import { getCurrentUserAddress } from "../../../services/dataService";

const Checkout = ({ setCheckout }) => {
  const { cartList, total, clearCart } = useCart();
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    country: "",
    phoneNumber: "",
    streetAddress: "",
    aptSuite: "",
    city: "",
    province: "",
    postalCode: "",
    deliveryInstructions: "",
  });
  const [isAddressSubmitted, setIsAddressSubmitted] = useState(false);
  const [selectedCard, setSelectedCard] = useState("");
  const navigate = useNavigate();

  const modalContentRef = useRef(null);

  // Fetch user data and pre-fill address form
  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0; // Scroll modal to top
    }

    async function fetchData() {
      try {
        console.log("Fetching user profile...");
        const token = getSession("token");
        console.log("Token retrieved:", token); // Log token

        if (!token) {
          throw new Error("User is not authenticated");
        }

        const address = await getCurrentUserAddress();
        console.log("User address successfully:", address);

        // Pre-fill the address form if address is available
        if (address) {
          setAddress({
            firstName: address.fullName.split(" ")[0] || "",
            lastName: address.fullName.split(" ")[1] || "",
            country: address.country || "",
            phoneNumber: address.phoneNumber || "",
            streetAddress: address.streetAddress || "",
            aptSuite: address.aptSuite || "",
            city: address.city || "",
            province: address.province || "",
            postalCode: address.postalCode || "",
            deliveryInstructions: address.deliveryInstructions || "",
          });
          setIsAddressSubmitted(true); // Address is already submitted
          console.log("Address form pre-filled with user data.");
        }
      } catch (error) {
        if (error.message === "User is not authenticated") {
          toast.error("Please log in to proceed with checkout.", {
            closeButton: true,
          });
          navigate("/login");
          console.log("User is not authenticated, redirecting to login.");
        } else {
          toast.error("Failed to fetch user data.", { closeButton: true });
          console.error("Error fetching user profile:", error);
        }
      }
    }
    fetchData();
  }, [navigate]);

  const handleOrderSubmit = async (event) => {
    event.preventDefault();
    console.log("Handling order submission...");

    // Check if the address is complete and submitted
    if (!isAddressSubmitted || !address || Object.keys(address).length === 0) {
      toast.error("Please complete your delivery address before proceeding.", {
        closeButton: true,
        position: "bottom-center",
      });
      console.log("Address not submitted or incomplete.");
      return;
    }

    // Check if a payment method is selected
    if (!selectedCard) {
      toast.error("Please select a payment method before proceeding.", {
        closeButton: true,
        position: "bottom-center",
      });
      console.log("Payment method not selected.");
      return;
    }

    try {
      // Construct the order data object
      console.log(cartList);
      const memberID = sessionStorage.getItem("userId");
      const orderData = {
        memberId: memberID, // Use the actual user ID
        orderDate: new Date().toISOString(),
        totalAmount: total,
        status: "Pending",
        orderDetails: cartList.map((item) => ({
          gameID: item.id,
          quantity: 1,
          price: item.price,
        })),
      };

      console.log("Creating order with data:", orderData);

      // Make API call to create the order
      const data = await createOrder(orderData);

      // Success: clear the cart and navigate to order summary page
      console.log("Order created successfully:", data);
      clearCart();
      navigate("/order-summary", { state: { data: data, status: true } });
    } catch (error) {
      // Enhanced error handling based on error type
      let errorMessage = "An error occurred while creating your order.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message; // Use API-provided error message
      }

      toast.error(errorMessage, {
        closeButton: true,
        position: "bottom-center",
      });
      console.error("Error creating order:", error);

      // Navigate to order summary page with failure status
      navigate("/order-summary", { state: { status: false } });
    }
  };

  const handleAddressSubmit = async (addressData) => {
    console.log("Submitting address data:", addressData);
    try {
      // Save address to backend
      const savedAddress = await saveAddress(addressData);
      console.log("Address saved successfully:", savedAddress);
      setAddress(savedAddress);
      setIsAddressSubmitted(true);
      toast.success("Address saved successfully.", {
        closeButton: true,
        position: "bottom-center",
      });
    } catch (error) {
      toast.error("Failed to save address. Please ensure you are logged in.", {
        closeButton: true,
        position: "bottom-center",
      });
      console.error("Error saving address:", error);
    }
  };

  const handleSelectCard = (event) => {
    console.log("Selected card:", event.target.value);
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
        <div
          ref={modalContentRef}
          className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700 max-h-screen w-full max-w-2xl p-4 overflow-y-auto"
        >
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
              <AddressForm
                onSubmit={handleAddressSubmit}
                address={address} // Pass the address data to pre-fill form
              />
            </div>

            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              <i className="bi bi-credit-card mr-2"></i>Card Payment
            </h3>

            <form onSubmit={handleOrderSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="cardSelect"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
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
                ${total.toFixed(2)}
              </p>

              <button
                type="submit"
                className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                  isAddressSubmitted
                    ? "bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
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
