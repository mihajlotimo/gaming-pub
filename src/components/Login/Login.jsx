import React, { useEffect, useRef, useState } from "react";
import "./Login.css";
import { assets } from "../../assets/assets";

const Login = ({ setLoginShow, loginShow, setUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const loginRef = useRef(null);
  const [isRegister, setIsRegister] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    mail: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const validateForm = () => {
    if (isRegister) {
      // Register validation
      if (
        !formData.fname ||
        !formData.lname ||
        !formData.mail ||
        !formData.username ||
        !formData.password
      ) {
        setError("Sva polja su obavezna");
        return false;
      }

      if (formData.password.length < 6) {
        setError("Lozinka mora imati najmanje 6 karaktera");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Lozinke se ne poklapaju");
        return false;
      }

      const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!mailRegex.test(formData.mail)) {
        setError("Unesite validnu mail adresu");
        return false;
      }
    } else {
      // Login validation
      if (!formData.username || !formData.password) {
        setError("Molimo unesite sve podatke");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        // Register
        const response = await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            fname: formData.fname,
            lname: formData.lname,
            mail: formData.mail,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Registration successful - switch to login
          setError("");
          setIsRegister(false);
          setFormData({
            fname: "",
            lname: "",
            mail: "",
            username: formData.username,
            password: formData.password,
            confirmPassword: "",
          });
          alert("Uspešno ste se registrovali! Možete se prijaviti.");
        } else {
          setError(data.error || "Greška pri registraciji");
        }
      } else {
        // Login
        const ismail = formData.username.includes("@");

        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [ismail ? "mail" : "username"]: formData.username,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Login successful
          localStorage.setItem("user", JSON.stringify(data));
          if (setUser) {
            setUser(data);
          }
          setLoginShow(false); // Close modal
          setFormData({
            fname: "",
            lname: "",
            mail: "",
            username: "",
            password: "",
            confirmPassword: "",
          });
        } else {
          setError(data.error || "Netačni podaci za prijavu");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Greška pri povezivanju sa serverom");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="login-div" ref={loginRef}>
        <h1 className="login-title">
          {isRegister ? "Registracija" : "Prijava"}
        </h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="login-input">
              <input
                type="text"
                name="fname"
                placeholder="Ime"
                value={formData.fname}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          )}
          {isRegister && (
            <div className="login-input">
              <input
                type="text"
                name="lname"
                placeholder="Prezime"
                value={formData.lname}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          )}
          {isRegister && (
            <div className="login-input">
              <input
                type="mail"
                name="mail"
                placeholder="mail"
                value={formData.mail}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          )}

          <div className="login-input">
            <input
              type="text"
              name="username"
              placeholder={
                isRegister ? "Korisničko ime" : "Email ili Korisničko ime"
              }
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="login-input password">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Lozinka"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
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
                name="confirmPassword"
                placeholder="Potvrdi lozinku"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
              <img
                src={showConfirmPassword ? assets.hide : assets.show}
                alt=""
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              />
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading
              ? isRegister
                ? "Registracija..."
                : "Prijava..."
              : isRegister
                ? "Registruj se"
                : "Prijavi se"}
          </button>
        </form>

        <span className="login-register">
          {isRegister ? "Već imate nalog?" : "Nemate nalog?"}{" "}
          <span
            className="login-register-link"
            onClick={() => {
              setIsRegister((prev) => !prev);
              setError("");
              setFormData({
                fname: "",
                lname: "",
                mail: "",
                username: "",
                password: "",
                confirmPassword: "",
              });
            }}
          >
            {isRegister ? "Prijavi se" : "Registruj se"}
          </span>
        </span>
      </div>
    </div>
  );
};

export default Login;
