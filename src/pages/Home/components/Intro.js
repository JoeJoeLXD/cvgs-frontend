// src/pages/Home/components/Intro.js
import React from "react";
import { Link } from "react-router-dom";

const Intro = () => {
  return (
    <section className="flex flex-col lg:flex-row dark:text-slate-100 items-center">
      <div className="text my-5 lg:mr-10"> {/* Add margin-right to the text container */}
    <h1 className="text-5xl font-bold">Conestoga Virtual Game Store</h1>
    <p className="text-2xl my-7 px-1 dark:text-slate-300">
      Welcome to the ultimate online game store. Join our exclusive CVGS
      Insiders Club to access special features, member-only events, and
      personalized game recommendations. Start your gaming journey with us!
    </p>
    <Link
      to="/products"
      type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      Explore Games
    </Link>
  </div>
      <div className="visual my-5 lg:max-w-xl">
        <img
          className="rounded-lg max-h-full"
          src={require('../../../assets/images/intro.png')}
          alt="CVGS Intro Section"
        />
      </div>
    </section>
  );
};

export default Intro;
