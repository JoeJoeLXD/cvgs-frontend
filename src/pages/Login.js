// src/pages/Login.js

import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import useTitle from "../hooks/useTitle";
import { login, resetPassword } from "../services";
import { useCart, useWishlist } from "../context";

const Login = ({ setUserEmail }) => {
  useTitle("Login");
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { refreshCart } = useCart(); 
  const { fetchWishlist } = useWishlist();

  // State to track login attempts
  const [loginAttempts, setLoginAttempts] = useState(0);
  const maxAttempts = 3;

  async function handleLogin(event) {
    event.preventDefault();
    if (loginAttempts >= maxAttempts) {
      toast.error("Too many failed login attempts. Please try again later.", {
        closeButton: true,
        position: "bottom-center",
      });
      return;
    }
  
    try {
      const authDetail = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
  
      const data = await login(authDetail);
  
      if (data.accessToken) {
        sessionStorage.setItem("token", data.accessToken);
        sessionStorage.setItem("userId", data.user.id);
        setUserEmail(data.user.email);
  
        refreshCart(); // Refresh the cart after login
        fetchWishlist();
  
        setTimeout(() => {
          navigate("/");
        }, 300);
      } else {
        setLoginAttempts((prev) => prev + 1);
        toast.error("Login failed. Please check your credentials.", {
          closeButton: true,
          position: "bottom-center",
        });
      }
    } catch (error) {
      setLoginAttempts((prev) => prev + 1);
  
      let errorMessage = "An error occurred during login. Please confirm in your email link.";
  
      if (error.response?.data?.error) {
        // Use the error message from the server if available
        errorMessage = error.response.data.error;
  
        // Specific message for unconfirmed emails
        if (errorMessage.toLowerCase().includes("confirm your email")) {
          errorMessage = "Please confirm in your email link.";
        }
      }
  
      toast.error(errorMessage, {
        closeButton: true,
        position: "bottom-center",
      });
    }
  }
  

  async function handleResetPassword() {
    try {
      const response = await resetPassword(resetEmail);
      if (response.ok) {
        toast.success("Password reset email sent!", {
          closeButton: true,
          position: "bottom-center",
        });
        setIsResettingPassword(false);
      } else {
        const errorData = await response.text();
        toast.error(
          `Error: ${
            errorData || "Error sending password reset email. Please try again."
          }`,
          {
            closeButton: true,
            position: "bottom-center",
          }
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send password reset email. Please try again.";
      toast.error(errorMessage, {
        closeButton: true,
        position: "bottom-center",
      });
    }
  }

  return (
    <main>
      <section>
        <p className="text-2xl text-center font-semibold dark:text-slate-100 my-10 underline underline-offset-8">
          Login
        </p>
      </section>

      {!isResettingPassword ? (
        <>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Your email
              </label>
              <input
                ref={emailRef}
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="johndoe@xxx.com"
                required
                autoComplete="off"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Your password
              </label>
              <input
                ref={passwordRef}
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={loginAttempts >= maxAttempts}
            >
              Log In
            </button>
            {loginAttempts >= maxAttempts && (
              <p className="mt-2 text-red-600 text-sm">
                You have reached the maximum number of login attempts.
              </p>
            )}
          </form>
          <div className="mt-4">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Not registered?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Please register here.
            </Link>
          </p>
        </>
      ) : (
        <div className="my-10">
          <h3 className="text-lg font-medium mb-4 dark:text-slate-100">
            Reset Your Password
          </h3>
          <input
            type="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
          <div className="flex mt-4 space-x-3">
            <button
              onClick={handleResetPassword}
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Send Reset Email
            </button>
            <button
              onClick={() => setIsResettingPassword(false)}
              className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Login;
