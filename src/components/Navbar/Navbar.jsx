import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const [menu, setMenu] = useState("pocetna");
  return (
    <div className="navbar">
      <Link to="/" className="logo-tekst">
        Avram35
      </Link>
      <ul className="navbar-menu">
        <li>
          <Link
            to="/"
            onClick={() => setMenu("pocetna")}
            className={menu === "pocetna" ? "active" : ""}
          >
            Pocetna
          </Link>
        </li>
        <li>
          <Link
            to="/igre"
            onClick={() => setMenu("igre")}
            className={menu === "igre" ? "active" : ""}
          >
            Igre
          </Link>
        </li>
        <li>
          <Link
            to="/rezervacija"
            onClick={() => setMenu("rezervacija")}
            className={menu === "rezervacija" ? "active" : ""}
          >
            Rezervacija
          </Link>
        </li>
        <li>
          <Link
            to="/cene"
            onClick={() => setMenu("cene")}
            className={menu === "cene" ? "active" : ""}
          >
            Cene
          </Link>
        </li>
        <li>
          <Link
            to="/onama"
            onClick={() => setMenu("onama")}
            className={menu === "onama" ? "active" : ""}
          >
            O nama
          </Link>
        </li>
      </ul>
      <div className="navbar-right">
        <Link>
          {/*<img src={assets.person} alt="" className="profile-icon" />*/}
          <button>Registruj se</button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
