// src/pages/PageNotFound.js
import React from "react";
import useTile from "../hooks/useTitle";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png"

const PageNotFound = () => {
  useTile("Page Not Found");
  return (
    <main className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
      <section className="flex flex-col justify-center px-2">
            <div className="flex flex-col items-center my-4">
                <p className="text-7xl text-gray-700 font-bold my-10 dark:text-white text-center">404, Oops!</p>
                <div className="max-w-xs">
                    <img className="" src={Logo} alt="CodeBook Page Not Found" />
                </div>
            </div>
            <div className="flex justify-center my-4">
                <Link to="/">
                    <button type="button" className="w-64 text-2xl text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2">Back To Home</button>
                </Link>
            </div>
        </section>
    </main>
  );
};

export default PageNotFound;
