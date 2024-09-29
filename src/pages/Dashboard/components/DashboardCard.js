// src/pages/Dashboard/components/DashboardCard.js
import React from "react";
import { Link } from "react-router-dom";

const DashboardCard = ({ order }) => {
  // Function to handle downloading a fake product as a .txt file
  const handleDownload = (product) => {
    // Create placeholder content for the .txt file
    const content = `Thank you for purchasing ${product.name}!
    
This is a fake download file for demonstration purposes only.

Enjoy your experience with GameHub!`;

    // Create a Blob from the content
    const blob = new Blob([content], { type: "text/plain" });

    // Create a link element for downloading the file
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${product.name}.txt`; // Set the file name based on product name
    link.click();
  };

  return (
    <div className="max-w-4xl m-auto p-2 mb-5 border dark:border-slate-700">
      <div className="flex justify-between text-sm m-2 font-bold dark:text-slate-200">
        <span>Order Id: {order.id}</span>
        <span>Total: ${order.amount_paid}</span>
      </div>
      {order.cartList.map((product) => (
        <div
          key={product.id}
          className="flex flex-wrap justify-between max-w-4xl m-auto p-2 my-5 "
        >
          <div className="flex">
            <Link to={`/products/${product.id}`}>
              <img
                className="w-32 rounded"
                src={product.poster}
                alt={product.name}
              />
            </Link>
            <div className="">
              <Link to={`/products/${product.id}`}>
                <p className="text-lg ml-2 dark:text-slate-200">{product.name}</p>
              </Link>
              <div className="text-lg m-2 dark:text-slate-200">
                <span>${product.price}</span>
              </div>
              {/* Add the Download Button */}
              <button
                onClick={() => handleDownload(product)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Download {product.name}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard;
