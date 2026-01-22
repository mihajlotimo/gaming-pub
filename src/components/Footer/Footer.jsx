import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import "./Footer.css";

const Footer = ({ menu }) => {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <Link
            to="/"
            className="logo-tekst"
            onClick={() => {
              window.scrollTo(0, 0);
            }}
          >
            Avram35
          </Link>
          <p>
            Avram35 je moderan gaming pub namenjen svim ljubiteljima video igara
            i digitalne zabave. Naša misija je da spojimo vrhunsku opremu,
            prijatnu atmosferu i pravi gejmerski duh kako bismo svakom gostu
            pružili nezaboravno iskustvo. Od kompetitivnih titula do opuštenog
            casual gejminga, Avram35 je mesto gde se ekipa okuplja, takmiči i
            uživa kao nigde drugde.
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.instagram_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>Gaming Pub</h2>
          <ul>
            <li>
              <Link
                to="/"
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
                className={menu === "pocetna" ? "active-footer" : ""}
              >
                Pocetna
              </Link>
            </li>
            <li>
              <Link
                to="/igre"
                className={menu === "igre" ? "active-footer" : ""}
              >
                Igre
              </Link>
            </li>
            <li>
              <Link
                to="/rezervacija"
                className={menu === "rezervacija" ? "active-footer" : ""}
              >
                Rezervacija
              </Link>
            </li>
            <li>
              <Link
                to="/cene"
                className={menu === "cene" ? "active-footer" : ""}
              >
                Cene
              </Link>
            </li>
            <li>
              <Link
                to="/onama"
                className={menu === "onama" ? "active-footer" : ""}
              >
                O nama
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Kontaktirajte nas</h2>
          <ul>
            <li>+381626985634</li>
            <li>avram35@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2025 © Avram35.com - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
