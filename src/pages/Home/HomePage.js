// src/pages/Home/HomePage.js
import React from "react";
import useTitle from "../../hooks/useTitle";
import { Intro, FeaturedProducts, Faq } from "./components";

const HomePage = () => {
  useTitle("Access CVGS - Team GameHub");
  return (
    <main className="container mx-auto max-w-6xl px-0 py-4">
      <Intro />
      <FeaturedProducts />
      <Faq />
    </main>
  );
};

export default HomePage;
