import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About/About.jsx";
import Footer from "./components/Footer/Footer";
import { Routes, Route } from "react-router-dom";
import Games from "./pages/Games/Games.jsx";
import Reservation from "./pages/Reservation/Reservation.jsx";
import Prices from "./pages/Prices/Prices.jsx";

const App = () => {
  return (
    <>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/igre" element={<Games />} />
          <Route path="/rezervacija" element={<Reservation />} />
          <Route path="/cene" element={<Prices />} />
          <Route path="/onama" element={<About />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
