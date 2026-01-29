import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About/About.jsx";
import Footer from "./components/Footer/Footer";
import { Routes, Route } from "react-router-dom";
import Games from "./pages/Games/Games.jsx";
import Reservation from "./pages/Reservation/Reservation.jsx";
import Prices from "./pages/Prices/Prices.jsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";
import Login from "./components/Login/Login.jsx";

const App = () => {
  const [menu, setMenu] = useState("pocetna");
  const [loginShow, setLoginShow] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <>
      <div className="app">
        <Navbar
          menu={menu}
          setMenu={setMenu}
          loginShow={loginShow}
          setLoginShow={setLoginShow}
          user={user}
          setUser={setUser}
        />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home setMenu={setMenu} />} />
          <Route path="/igre" element={<Games />} />
          <Route path="/rezervacija" element={<Reservation />} />
          <Route path="/cene" element={<Prices setMenu={setMenu} />} />
          <Route path="/onama" element={<About setMenu={setMenu} />} />
        </Routes>
      </div>
      <Footer menu={menu} setMenu={setMenu} />
      {loginShow && (
        <Login
          setLoginShow={setLoginShow}
          loginShow={loginShow}
          setUser={setUser}
        />
      )}
    </>
  );
};

export default App;
