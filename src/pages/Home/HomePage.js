// src/pages/Home/HomePage.js
import React from "react";
import useTitle from "../../hooks/useTitle";
import { Intro, FeaturedProducts, Faq } from "./components";

const HomePage = () => {
  useTitle("Access CVGS - Team GameHub");
  return (
    <main className="container mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
      <Intro />
      <FeaturedProducts />
      <Faq />
    </main>
  );
};

export default HomePage;
