import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Navbar = ({ menu, setMenu, setLoginShow, user, setUser }) => {
  const { pathname } = useLocation();

  const [openMenu, setOpenMenu] = useState(false);

  const [openDrop, setOpenDrop] = useState(false);

  const navigate = useNavigate(null);

  useEffect(() => {
    if (pathname === "/") setMenu("pocetna");
    else if (pathname === "/igre") setMenu("igre");
    else if (pathname === "/rezervacija") setMenu("rezervacija");
    else if (pathname === "/cene") setMenu("cene");
    else if (pathname === "/onama") setMenu("onama");

    setOpenMenu(false);
  }, [pathname]);
  return (
    <div className="wrapper">
      <div className="navbar">
        <Link to="/" className="logo-tekst-navbar">
          Avram35
        </Link>
        <ul className={`navbar-menu ${openMenu ? "open" : ""}`}>
          <li>
            <Link to="/" className={menu === "pocetna" ? "active" : ""}>
              Pocetna
            </Link>
          </li>
          <li>
            <Link to="/igre" className={menu === "igre" ? "active" : ""}>
              Igre
            </Link>
          </li>
          <li>
            <Link
              to="/rezervacija"
              className={menu === "rezervacija" ? "active" : ""}
            >
              Rezervacija
            </Link>
          </li>
          <li>
            <Link to="/cene" className={menu === "cene" ? "active" : ""}>
              Cene
            </Link>
          </li>
          <li>
            <Link to="/onama" className={menu === "onama" ? "active" : ""}>
              O nama
            </Link>
          </li>
          {openMenu && (
            <li>
              {user ? (
                <div
                  className="user-dropdown"
                  onClick={() => {
                    if (window.innerWidth <= 768) {
                      setOpenDrop((prev) => !prev);
                    }
                  }}
                >
                  <div className="user-logged">
                    <img src={assets.user} alt="" className="user-logged-img" />
                    <span className="user-logged-username">
                      {user.username}
                    </span>
                    <img
                      src={assets.down}
                      alt=""
                      className={`user-down-img ${openDrop ? "open" : ""}`}
                    />
                  </div>
                  <div
                    className={`user-dropdown-menu ${openDrop ? "open" : ""}`}
                  >
                    <span>Uredi profil</span>
                    <span>Vidi rezervacije</span>
                    <span
                      onClick={() => {
                        localStorage.removeItem("user");
                        setUser(null);
                        setOpenMenu(false);
                        navigate("/");
                      }}
                    >
                      Odjavi se
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  className="navbar-button"
                  onClick={() => setLoginShow(true)}
                >
                  Registruj se
                </button>
              )}
            </li>
          )}
        </ul>
        {openMenu ? (
          <img
            src={assets.close}
            alt=""
            onClick={() => {
              (setOpenMenu(false), setOpenDrop(false));
            }}
            className="close-icon"
          />
        ) : (
          <img
            src={assets.more}
            alt=""
            className="menu-icon"
            onClick={() => setOpenMenu((prev) => !prev)}
          />
        )}

        <div className="navbar-right">
          {/*<img src={assets.person} alt="" className="profile-icon" />*/}
          {user ? (
            <div className="user-dropdown">
              <div className="user-logged">
                <img src={assets.user} alt="" className="user-logged-img" />
                <span className="user-logged-username">{user.username}</span>
                <img src={assets.down} alt="" className={`user-down-img`} />
              </div>
              <div className={`user-dropdown-menu`}>
                <span>Uredi profil</span>
                <span>Vidi rezervacije</span>
                <span
                  onClick={() => {
                    localStorage.removeItem("user");
                    setUser(null);

                    setOpenDrop(false);
                    navigate("/");
                  }}
                >
                  Odjavi se
                </span>
              </div>
            </div>
          ) : (
            <button
              className="navbar-button"
              onClick={() => setLoginShow(true)}
            >
              Registruj se
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
