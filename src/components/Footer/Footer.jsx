import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <Link to="/" className="logo-tekst">
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
            <li>Početna</li>
            <li>Igre</li>
            <li>Rezervacija</li>
            <li>Cene</li>
            <li>O nama</li>
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
