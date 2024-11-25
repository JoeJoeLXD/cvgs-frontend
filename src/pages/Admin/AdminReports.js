// src/pages/Admin/AdminReports.js
import React, { useState, useEffect } from "react";

const AdminReports = () => {
  const [games, setGames] = useState([]);
  const [members, setMembers] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [sales, setSales] = useState([]);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  // Fetch addresses data from the server
  useEffect(() => {
    async function fetchAddresses() {
      try {
        const response = await fetch("https://localhost:7245/api/Addresses");
        if (!response.ok) {
          throw new Error("Error fetching addresses data");
        }
        const data = await response.json();
        const addressesData = data.$values || data;

        setAddresses(addressesData);
      } catch (error) {
        console.error("Error fetching addresses data:", error);
      }
    }
    fetchAddresses();
  }, []);

  // Fetch orders data from the server
  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("https://localhost:7245/api/Orders");
        if (!response.ok) {
          throw new Error("Error fetching orders data");
        }
        const data = await response.json();
        const orderData = data.$values || data;
        setOrders(orderData);
      } catch (error) {
        console.error("Error fetching orders data:", error);
      }
    }
    fetchOrders();
  }, []);

  // Fetch sales data from the server
  useEffect(() => {
    async function fetchSales() {
      try {
        const response = await fetch("https://localhost:7245/api/OrderDetails");
        if (!response.ok) {
          throw new Error("Error fetching sales data");
        }
        const data = await response.json();
        const salesData = data.$values || data;

        setSales(salesData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    }
    fetchSales();
  }, []);

  // Fetch the game list from the server
  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch("https://localhost:7245/api/Games");
        if (!response.ok) {
          throw new Error("Error fetching game list");
        }
        const data = await response.json();
        const gameData = data.$values || data;

        // Sort the games by Category first, then by Game Name
        const sortedGames = gameData.sort((a, b) => {
          if (a.gameCategory?.name < b.gameCategory?.name) return -1;
          if (a.gameCategory?.name > b.gameCategory?.name) return 1;
          if (a.gameName < b.gameName) return -1;
          if (a.gameName > b.gameName) return 1;
          return 0;
        });

        setGames(sortedGames);
      } catch (error) {
        console.error("Error fetching game list:", error);
      }
    }
    fetchGames();
  }, []);

  // Fetch the member list from the server
  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch("https://localhost:7245/api/UserProfiles");
        if (!response.ok) {
          throw new Error("Error fetching member list");
        }
        const data = await response.json();
        const memberData = data.$values || data;

        setMembers(memberData);
      } catch (error) {
        console.error("Error fetching member list:", error);
      }
    }
    fetchMembers();
  }, []);

  // Fetch the wish list from the server
  useEffect(() => {
    async function fetchWishlists() {
      try {
        const response = await fetch("https://localhost:7245/api/WishLists");
        if (!response.ok) {
          throw new Error("Error fetching wish list");
        }
        const data = await response.json();
        const wishlistData = data.$values || data;

        setWishlists(wishlistData);
      } catch (error) {
        console.error("Error fetching wish list:", error);
      }
    }
    fetchWishlists();
  }, []);

  // Generate and download PDF for Member Address Report
  const handleDownloadMemberAddressReportPDF = () => {
    if (addresses.length === 0) {
      console.error("No address data available to download.");
      return;
    }

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) {
      console.error(
        "Print window could not be opened. Pop-up blocker may be preventing this action."
      );
      return;
    }

    printWindow.document.write(`
    <html>
      <head>
        <title>CVGS Member Address Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h1>CVGS Member Address Report</h1>
        <table>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Member Display Name</th>
              <th>Full Name</th>
              <th>Phone No.</th>
              <th>Street Address</th>
              <th>City</th>
              <th>Province</th>
              <th>Country</th>
              <th>Postal Code</th>
              <th>Delivery Instructions</th>
            </tr>
          </thead>
          <tbody>
            ${addresses
              .map((address, index) => {
                const member = members.find(
                  (m) => m.userId === address.memberID
                );
                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${member ? member.displayName : "N/A"}</td>
                    <td>${address.fullName}</td>
                    <td>${address.phoneNumber}</td>
                    <td>${address.streetAddress} ${
                  address.aptSuite ? `, ${address.aptSuite}` : ""
                }</td>
                    <td>${address.city}</td>
                    <td>${address.province}</td>
                    <td>${address.country}</td>
                    <td>${address.postalCode}</td>
                    <td>${address.deliveryInstructions || "N/A"}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `);
    printWindow.document.close();

    // Add an event listener to ensure the print method is called after the content has fully loaded
    printWindow.onload = () => {
      console.log("Print window loaded successfully, attempting to print.");
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500); // Delay of 500 milliseconds
    };
  };

  // Generate and download PDF for Order Details Report
  const handleDownloadOrderDetailsReportPDF = () => {
    // Open a new window immediately to avoid pop-up blocking issues.
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (!printWindow) {
      console.error(
        "Print window could not be opened. Pop-up blocker may be preventing this action."
      );
      return;
    }

    // Add console logs to inspect the data
    console.log("Sales data:", sales);
    console.log("Members data:", members);
    console.log("Games data:", games);
    console.log("Orders data:", orders);

    // Check if all data is available
    if (
      sales.length === 0 ||
      members.length === 0 ||
      games.length === 0 ||
      orders.length === 0
    ) {
      console.error(
        "One or more required data sets are empty. Aborting PDF generation."
      );
      printWindow.document.write(
        "<p>Data not loaded properly. Please try again later.</p>"
      );
      printWindow.document.close();
      return;
    }

    console.log("Download Order Details Report button clicked.");

    // Filter members with sales by associating orders with members
    const membersWithOrders = members.filter((member) =>
      orders.some((order) => order.memberID === member.userId)
    );

    if (membersWithOrders.length === 0) {
      console.error("No members with sales found. Closing print window.");
      printWindow.document.write("<p>No members with sales data found.</p>");
      printWindow.document.close();
      return;
    }

    console.log("Members with orders:", membersWithOrders);

    // Generate HTML content
    let htmlContent = `
    <html>
      <head>
        <title>CVGS Order Details Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          h2 {
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <h1>CVGS Order Details Report</h1>
  `;

    // Generate the content for each member
    membersWithOrders.forEach((member) => {
      // Find orders for the current member
      const memberOrders = orders.filter(
        (order) => order.memberID === member.userId
      );

      // Skip if no orders are found for the member
      if (memberOrders.length === 0) {
        return;
      }

      htmlContent += `
      <h2>Member: ${member.displayName}</h2>
      <table>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Game Name</th>
            <th>Order Date</th>
            <th>Price ($)</th>
          </tr>
        </thead>
        <tbody>
    `;

      // Generate sales rows for each order of the member
      let grandTotal = 0;
      let index = 1; // Keep track of overall sales items
      memberOrders.forEach((order) => {
        const orderDetails = sales.filter(
          (sale) => sale.orderID === order.orderID
        );

        // Skip if no order details are found
        if (orderDetails.length === 0) {
          return;
        }

        orderDetails.forEach((sale) => {
          const game = games.find((g) => g.id === sale.gameID);

          // Ensure game exists before adding to the table
          if (!game) {
            console.warn(`Game not found for sale with gameID: ${sale.gameID}`);
            return;
          }

          htmlContent += `
          <tr>
            <td>${index++}</td>
            <td>${game.gameName}</td>
             <td>${new Date(order.orderDate).toLocaleDateString()}</td>
            <td>${(sale.price * sale.quantity).toFixed(2)}</td>
          </tr>
        `;

          grandTotal += sale.price * sale.quantity;
        });
      });

      // If there were no sales details for the member, skip the footer and closing tags
      if (index > 1) {
        htmlContent += `
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align:right; font-weight:bold;">Grand Total:</td>
              <td style="font-weight:bold;">${grandTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <hr />
      `;
      }
    });

    // Close the HTML content and write it to the print window
    htmlContent += "</body></html>";
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Add an event listener to ensure the print method is called after the content has fully loaded
    printWindow.onload = () => {
      console.log("Print window loaded successfully, attempting to print.");
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500); // Delay of 500 milliseconds
    };
  };

  // Generate and download PDF for Sales Report
  const handleDownloadSalesReportPDF = () => {
    if (sales.length === 0) {
      console.error("No sales data available to download.");
      return;
    }

    // Group sales data by game
    const salesSummary = sales.reduce((acc, sale) => {
      const game = games.find((g) => g.id === sale.gameID);
      if (game) {
        if (!acc[game.gameName]) {
          acc[game.gameName] = {
            gameName: game.gameName,
            unitPrice: sale.price,
            totalQuantity: 0,
            totalPrice: 0,
          };
        }
        acc[game.gameName].totalQuantity += sale.quantity;
        acc[game.gameName].totalPrice += sale.price * sale.quantity;
      }
      return acc;
    }, {});

    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
      <html>
        <head>
          <title>CVGS Sales Report</title>
        </head>
        <body>
          <h1>CVGS Sales Report</h1>
          <table border="1" style="width:100%; text-align:left; border-collapse:collapse;">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Game Name</th>
                <th>Unit Price ($)</th>
                <th>Total Quantity Sold</th>
                <th>Total Sales ($)</th>
              </tr>
            </thead>
            <tbody>
              ${Object.values(salesSummary)
                .map(
                  (sale, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${sale.gameName}</td>
                    <td>${sale.unitPrice}</td>
                    <td>${sale.totalQuantity}</td>
                    <td>${sale.totalPrice.toFixed(2)}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="text-align:right; font-weight:bold;">Grand Total:</td>
                <td style="font-weight:bold;">
                  ${Object.values(salesSummary)
                    .reduce((sum, sale) => sum + sale.totalPrice, 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Generate and download PDF for Game List Report
  const handleDownloadGameListReportPDF = () => {
    if (games.length === 0) {
      console.error("No game data available to download.");
      return;
    }

    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>CVGS Game List Report</title>
          </head>
          <body>
            <h1>CVGS Game List Report</h1>
            <table border="1" style="width:100%; text-align:left; border-collapse:collapse;">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Game Name</th>
                  <th>Overview</th>
                  <th>Category</th>
                  <th>Price ($)</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                ${games
                  .map(
                    (game, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${game.gameName}</td>
                      <td>${game.overview}</td>
                      <td>${
                        game.gameCategory ? game.gameCategory.name : "N/A"
                      }</td>
                      <td>${game.price}</td>
                      <td>${game.gamesInStock}</td>
                    </tr>
                  `
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Generate and download PDF for Member List Report
  const handleDownloadMemberListReportPDF = () => {
    if (members.length === 0) {
      console.error("No member data available to download.");
      return;
    }

    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>CVGS Member List Report</title>
          </head>
          <body>
            <h1>CVGS Member List Report</h1>
            <table border="1" style="width:100%; text-align:left; border-collapse:collapse;">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Member Display Name</th>
                  <th>Email</th>
                  <th>Birth Date</th>
                  <th>Gender</th>
                  <th>Receive Promotional Emails</th>
                </tr>
              </thead>
              <tbody>
                ${members
                  .map(
                    (member, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${member.displayName}</td>
                      <td>${member.email}</td>
                      <td>${
                        member.birthOfDate !== "0001-01-01"
                          ? new Date(member.birthOfDate).toLocaleDateString()
                          : "N/A"
                      }</td>
                      <td>${member.gender || "N/A"}</td>
                      <td>${
                        member.isReceivePromotionalEmails ? "Yes" : "No"
                      }</td>
                    </tr>
                  `
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Generate and download PDF for Wish List Report
  const handleDownloadWishListReportPDF = () => {
    if (wishlists.length === 0) {
      console.error("No wishlist data available to download.");
      return;
    }

    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>CVGS Wish List Report</title>
          </head>
          <body>
            <h1>CVGS Wish List Report</h1>
            <table border="1" style="width:100%; text-align:left; border-collapse:collapse;">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Member Display Name</th>
                  <th>Game Name</th>
                  <th>Date Added</th>
                </tr>
              </thead>
              <tbody>
                ${wishlists
                  .map((wishlist, index) => {
                    const member = members.find(
                      (m) => m.userId === wishlist.memberID
                    );
                    const game = games.find((g) => g.id === wishlist.gameID);
                    return `
                      <tr>
                        <td>${index + 1}</td>
                        <td>${member ? member.displayName : "N/A"}</td>
                        <td>${game ? game.gameName : "N/A"}</td>
                        <td>${new Date(
                          wishlist.dateAdded
                        ).toLocaleString()}</td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-6 py-4 dark:bg-gray-800">
      <h1 className="text-2xl font-semibold my-4 dark:text-white">CVGS Reports</h1>
      <p className="dark:text-gray-300">Select a report below to generate and download the PDF.</p>
      <div className="mt-4">
        <table className="min-w-full bg-white border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 border text-left font-semibold dark:text-gray-300">Report Title</th>
              <th className="px-4 py-2 border text-left font-semibold dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-4 py-2 border dark:border-gray-600 dark:text-gray-400">CVGS Game List Report</td>
              <td className="px-4 py-2 border dark:border-gray-600">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150 dark:bg-blue-700 dark:hover:bg-blue-600"
                  onClick={handleDownloadGameListReportPDF}
                >
                  Download PDF
                </button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-4 py-2 border dark:border-gray-600 dark:text-gray-400">CVGS Member List Report</td>
              <td className="px-4 py-2 border dark:border-gray-600">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150 dark:bg-blue-700 dark:hover:bg-blue-600"
                  onClick={handleDownloadMemberListReportPDF}
                >
                  Download PDF
                </button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-4 py-2 border dark:border-gray-600 dark:text-gray-400">CVGS Wish List Report</td>
              <td className="px-4 py-2 border dark:border-gray-600">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150 dark:bg-blue-700 dark:hover:bg-blue-600"
                  onClick={handleDownloadWishListReportPDF}
                >
                  Download PDF
                </button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-4 py-2 border dark:border-gray-600 dark:text-gray-400">CVGS Sales Report</td>
              <td className="px-4 py-2 border dark:border-gray-600">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150 dark:bg-blue-700 dark:hover:bg-blue-600"
                  onClick={handleDownloadSalesReportPDF}
                >
                  Download PDF
                </button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-4 py-2 border dark:border-gray-600 dark:text-gray-400">CVGS Order Details Report</td>
              <td className="px-4 py-2 border dark:border-gray-600">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150 dark:bg-blue-700 dark:hover:bg-blue-600"
                  onClick={handleDownloadOrderDetailsReportPDF}
                >
                  Download PDF
                </button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-4 py-2 border dark:border-gray-600 dark:text-gray-400">CVGS Member Address Report</td>
              <td className="px-4 py-2 border dark:border-gray-600">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150 dark:bg-blue-700 dark:hover:bg-blue-600"
                  onClick={handleDownloadMemberAddressReportPDF}
                >
                  Download PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
