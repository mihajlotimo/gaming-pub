import React, { useEffect, useRef, useState } from "react";
import "./Login.css";
import { assets } from "../../assets/assets";

const Login = ({ setLoginShow, loginShow }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const loginRef = useRef(null);
  const [isRegister, setIsRegister] = useState(true);

  useEffect(() => {
    const handleClick = (e) => {
      if (loginRef.current && !loginRef.current.contains(e.target)) {
        setLoginShow(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [setLoginShow]);

  return (
    <div className="overlay">
      <div className="login-div" ref={loginRef}>
        <h1 className="login-title">
          {isRegister ? "Registracija" : "Prijava"}
        </h1>

        {isRegister && (
          <div className="login-input">
            <input type="text" placeholder="Ime" />
          </div>
        )}
        {isRegister && (
          <div className="login-input">
            <input type="text" placeholder="Prezime" />
          </div>
        )}
        {isRegister && (
          <div className="login-input">
            <input type="text" placeholder="Email" />
          </div>
        )}

        <div className="login-input">
          <input
            type="text"
            placeholder={
              isRegister ? "Korisničko ime" : "Email ili Korisničko ime"
            }
          />
        </div>
        <div className="login-input password">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Lozinka"
          />
          <img
            src={showPassword ? assets.hide : assets.show}
            alt=""
            onClick={() => setShowPassword((prev) => !prev)}
          />
        </div>
        {isRegister && (
          <div className="login-input password">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Potvrdi lozinku"
            />
            <img
              src={showConfirmPassword ? assets.hide : assets.show}
              alt=""
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            />
          </div>
        )}

        <button className="login-button">
          {isRegister ? "Registruj se" : "Prijavi se"}
        </button>
        <span className="login-register">
          {isRegister ? "Već imate nalog?" : "Nemate nalog?"}{" "}
          <span
            className="login-register-link"
            onClick={() => setIsRegister((prev) => !prev)}
          >
            {isRegister ? "Prijavi se" : "Registruj se"}
          </span>
        </span>
      </div>
    </div>
  );
};

export default Login;
