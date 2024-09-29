// src/pages/Home/HomePage.js
import React from "react";
import useTitle from "../../hooks/useTitle";
import { Intro, FeaturedProducts, Faq } from "./components";

const HomePage = () => {
  useTitle("Access CVGS - Team GameHub");
  return (
    <main>
      <Intro />
      <FeaturedProducts />
      <Faq />
    </main>
  );
};

export default HomePage;
