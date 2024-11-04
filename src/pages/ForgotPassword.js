// src/pages/ForgotPassword.js

import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
  const emailRef = useRef();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    if (email) {
      try {
        const response = await forgotPassword({ email });
        if (response.ok) {
          toast.success("Password reset email sent! Please check your email for the reset link.", {
            closeButton: true,
            position: "bottom-center",
          });
        } else {
          const errorData = await response.text();
          toast.error(`Error: ${errorData || "Error sending password reset email. Please try again."}`, {
            closeButton: true,
            position: "bottom-center",
          });
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to send password reset email. Please try again.";
        toast.error(errorMessage, {
          closeButton: true,
          position: "bottom-center",
        });
      }
    } else {
      toast.error("Please enter a valid email address", {
        closeButton: true,
        position: "bottom-center",
      });
    }
  };

  return (
    <main>
      <section>
        <p className="text-2xl text-center font-semibold dark:text-slate-100 my-10 underline underline-offset-8">
          Forgot Password
        </p>
      </section>
      <form onSubmit={handleForgotPassword}>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Enter your email
          </label>
          <input
            ref={emailRef}
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="johndoe@example.com"
            required
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Reset Password
        </button>
      </form>

      <div className="mt-5 text-center">
        <Link to="/login" className="text-blue-700 hover:underline dark:text-blue-500">
          Back to Login
        </Link>
      </div>
    </main>
  );
};

export default ForgotPassword;

