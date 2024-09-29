// src/pages/Register.j
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import { toast } from "react-toastify";
import { register } from "../services";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
  useTitle("Register");
  const navigate = useNavigate();
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [captchaValidated, setCaptchaValidated] = useState(false);

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaValidated(true);
    }
  };

  async function handleRegister(event) {
    event.preventDefault();

    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      return;
    }

    if (!captchaValidated) {
      toast.error("Please complete the CAPTCHA validation", {
        closeButton: true,
        position: "bottom-center",
      });
      return;
    }

    try {
      const authDetail = {
        name: event.target.name.value,
        email: event.target.email.value,
        password: password,
      };
      const data = await register(authDetail);
      data.accessToken
        ? navigate("/products")
        : toast.error(data, {
            closeButton: true,
            position: "bottom-center",
          });
      // Simulate email verification notice
      toast.success(
        "A verification link has been sent to your email address. Please verify your account.",
        {
          closeButton: true,
          position: "bottom-center",
        }
      );
    } catch (error) {
      toast.error(error.message, {
        closeButton: true,
        position: "bottom-center",
      });
    }
  }

  return (
    <main>
      <section>
        <p className="text-2xl text-center font-semibold dark:text-slate-100 my-10 underline underline-offset-8">
          Register
        </p>
      </section>
      <form onSubmit={handleRegister}>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Display Name
          </label>
          <input
            type="text"
            id="name"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="JohnDoe123"
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
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
            type="password"
            id="password"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
            minLength="7" // Allow 7 characters for easier testing
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Confirm password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
            minLength="7"
          />
        </div>

        {passwordMatchError && (
          <p className="text-red-500 text-sm mb-3">{passwordMatchError}</p>
        )}

        {/* CAPTCHA Validation */}
        <div className="mb-6">
          <ReCAPTCHA
            sitekey="6LdwwFIqAAAAAFmMYxEHteLgqKssk1XQT63c6II7"
            onChange={handleCaptchaChange}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Register
        </button>
      </form>
    </main>
  );
};

export default Register;
