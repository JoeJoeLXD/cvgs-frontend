// src/pages/Home/components/FeaturedProducts.js
import React from "react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { ProductCard } from "../../../components";
import { getProductList } from "../../../services";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  // Helper function to randomly select 2 games from the list
  const getRandomFeaturedGames = (games) => {
    if (games.length <= 2) {
      return games; // Return all games if there are 2 or fewer
    }
    const shuffled = [...games].sort(() => 0.5 - Math.random()); // Shuffle the games array
    return shuffled.slice(0, 2); // Get the first two games
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProductList(); // Fetch all games from /api/Games
        const randomFeaturedGames = getRandomFeaturedGames(data);
        setProducts(randomFeaturedGames);
      } catch (error) {
        console.error("Error fetching games:", error); // Log the full error for debugging
        toast.error(`Failed to load featured games: ${error.message}`, {
          closeButton: true,
          position: "bottom-center",
        });
      }
    }
    fetchProducts();
  }, []);

  return (
    <section className="my-20">
      <h1 className="text-2xl text-center font-semibold dark:text-slate-100 mb-5 underline underline-offset-8">
        Featured Games
      </h1>
      <div className="flex flex-wrap justify-center lg:flex-row">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center text-xl dark:text-slate-100">No featured games available</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;


