// src/pages/Dashboard/DashboardPage.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useTitle from "../../hooks/useTitle";
import { getUserOrders } from "../../services";
import DashboardCard from "./components/DashboardCard";
import DashboardEmpty from "./components/DashboardEmpty";

const DashboardPage = () => {
  const [orders, setOrders] = useState([]);
  useTitle("Dashboard");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getUserOrders();
        console.log(data);
        setOrders(data);
      } catch (error) {
        toast.error(error.message, {
          closeButton: true,
          position: "bottom-center",
        });
      }
    }
    fetchOrders();
  }, []);

  return (
    <main>
      <section>
        <p className="text-2xl text-center font-semibold dark:text-slate-100 my-10 underline underline-offset-8">
          My Orders
        </p>
      </section>

      <section>
        {orders.length > 0 ? (
          orders.map((order, i) => (
            <DashboardCard key={order.orderID} order={order} num={i} />
          ))
        ) : (
          <DashboardEmpty />
        )}
      </section>
    </main>
  );
};

export default DashboardPage;
