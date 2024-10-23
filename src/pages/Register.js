// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

// Password rules provided by the API response
const passwordRulesFromAPI = [
  {
    code: "PasswordRequiresNonAlphanumeric",
    description: "Passwords must have at least one non alphanumeric character.",
  },
  {
    code: "PasswordRequiresDigit",
    description: "Passwords must have at least one digit ('0'-'9').",
  },
  {
    code: "PasswordRequiresUpper",
    description: "Passwords must have at least one uppercase ('A'-'Z').",
  },
];

const Register = () => {
  useTitle("Register");
  const navigate = useNavigate();
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [captchaValidated, setCaptchaValidated] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    hasNonAlphanumeric: false,
    hasDigit: false,
    hasUpper: false,
  });

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaValidated(true);
    }
  };

  const validatePassword = (password) => {
    setPasswordValidation({
      hasNonAlphanumeric: /[^a-zA-Z0-9]/.test(password),
      hasDigit: /\d/.test(password),
      hasUpper: /[A-Z]/.test(password),
    });
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
        displayName: event.target.displayName.value,
        email: event.target.email.value,
        password: password,
      };
  
      const response = await fetch("https://localhost:7245/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authDetail),
      });
  
      const contentType = response.headers.get("content-type");
      let data;
  
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
  
      if (!response.ok) {
        // Check if the error contains the DuplicateUserName message
        if (data && data.$values && data.$values[0].code === "DuplicateUserName") {
          throw new Error(data.$values[0].description); // Use the error message from the response
        }
        throw new Error(data || "Registration failed");
      }
  
      toast.success("A verification link has been sent to your email address. Please verify your account.", {
        closeButton: true,
        position: "bottom-center",
      });
  
      navigate("/products"); // Redirect user after successful registration
    } catch (error) {
      console.error("Error during registration:", error); // Log error details
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
            htmlFor="displayName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
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
            minLength="7"
            onChange={(e) => validatePassword(e.target.value)} // Validate password as user types
          />
          {/* Display the password rules from API */}
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {passwordRulesFromAPI.map((rule, index) => (
              <p
                key={index}
                className={
                  (rule.code === "PasswordRequiresNonAlphanumeric" && passwordValidation.hasNonAlphanumeric) ||
                  (rule.code === "PasswordRequiresDigit" && passwordValidation.hasDigit) ||
                  (rule.code === "PasswordRequiresUpper" && passwordValidation.hasUpper)
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {rule.description}
              </p>
            ))}
          </div>
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



