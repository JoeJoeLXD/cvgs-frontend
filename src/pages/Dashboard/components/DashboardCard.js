// src/pages/Dashboard/components/DashboardCard.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DashboardCard = ({ order, num }) => {
  const [gameNames, setGameNames] = useState([]);

  useEffect(() => {
    const fetchGameNames = async () => {
      try {
        const gameIds = order.orderDetails["$values"].map(
          (detail) => detail.gameID
        );

        const gameNamePromises = gameIds.map(async (gameID) => {
          const response = await fetch(
            `https://localhost:7245/api/Games/${gameID}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch game details");
          }
          const data = await response.json();
          return data.gameName;
        });

        const names = await Promise.all(gameNamePromises);
        setGameNames(names);
      } catch (error) {
        console.error("Error fetching game names:", error.message);
      }
    };

    fetchGameNames();
  }, [order]);

  // Function to handle downloading a fake product as a .txt file
  const handleDownload = (gameName) => {
    // Create placeholder content for the .txt file
    const content = `Thank you for purchasing ${gameName}!
    
This is a fake download file for demonstration purposes only.

Enjoy your experience with GameHub!`;

    // Create a Blob from the content
    const blob = new Blob([content], { type: "text/plain" });

    // Create a link element for downloading the file
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${gameName}.txt`; // Set the file name based on game name
    link.click();
  };

  const imagesList = [
    "/assets/images/10001.avif",
    "/assets/images/10002.avif",
    "/assets/images/10003.avif",
    "/assets/images/10004.avif",
    "/assets/images/10005.avif",
  ];

  return (
    <div className="max-w-4xl m-auto p-2 mb-5 border dark:border-slate-700">
      <div className="flex justify-between text-sm m-2 font-bold dark:text-slate-200">
        <span>Order Id: {num + 1}</span>
        <span>Total: ${order.totalAmount}</span>
      </div>
      {order.orderDetails["$values"].map((detail, i) => (
        <div
          key={detail.orderDetailID}
          className="flex flex-wrap justify-between max-w-4xl m-auto p-2 my-5 "
        >
          <div className="flex">
            <Link to={`/products/${detail.gameID}`}>
              <img
                className="w-32 rounded"
                src={imagesList[Math.floor(Math.random() * imagesList.length)]}
                alt="Product Poster"
              />
            </Link>
            <div>
              <Link to={`/products/${detail.gameID}`}>
                <p className="text-lg ml-2 dark:text-slate-200">
                  {gameNames[i] || "Loading..."}
                </p>
              </Link>
              <div className="text-lg m-2 dark:text-slate-200">
                <span>${detail.price}</span>
              </div>
              {/* Download Button */}
              <button
                onClick={() => handleDownload(gameNames[i] || "Loading...")}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!gameNames[i]} // Disable if game name is not yet loaded
              >
                Download {gameNames[i] || "Loading..."}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard;

