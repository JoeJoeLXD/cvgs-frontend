// src/App.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import { Header, Footer, Navbar } from "./components"; 
import { AllRoutes } from "./routes/AllRoutes";
import "./index.css";

function App() {
  const [userEmail, setUserEmail] = useState(
    sessionStorage.getItem("email") || ""
  );

  const location = useLocation(); 

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  // Determine if the current route is an admin route
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <div className="dark:bg-dark">
      <Header userEmail={userEmail} />
      {!isAdminPath && <Navbar />} {/* Conditionally render Navbar */}
      <AllRoutes setUserEmail={setUserEmail} /> {/* Passing setUserEmail to AllRoutes */}
      <Footer />
    </div>
  );
}

export default App;





