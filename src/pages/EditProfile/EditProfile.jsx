import React, { useState } from "react";
import "./EditProfile.css";
import { assets } from "../../assets/assets";
const API_URL = import.meta.env.VITE_API_URL;

const EditProfile = ({ user, setUser }) => {
  const [editing, setEditing] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fname: user?.fname || "",
    lname: user?.lname || "",
    username: user?.username || "",
    mail: user?.mail || "",
    oldPassword: "",
    newPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.fname.trim()) {
      setError("Ime je obavezno");
      return false;
    }
    if (!formData.lname.trim()) {
      setError("Prezime je obavezno");
      return false;
    }
    if (!formData.username.trim()) {
      setError("Korisničko ime je obavezno");
      return false;
    }
    if (!formData.mail.trim()) {
      setError("E-mail je obavezan");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.mail)) {
      setError("Unesite validan e-mail");
      return false;
    }

    if (changePassword) {
      if (!formData.oldPassword) {
        setError("Unesite staru lozinku");
        return false;
      }
      if (!formData.newPassword) {
        setError("Unesite novu lozinku");
        return false;
      }
      if (formData.newPassword.length < 6) {
        setError("Nova lozinka mora imati najmanje 6 karaktera");
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
    setError(null);

    try {
      const updates = [];

      if (formData.fname !== user.fname) {
        updates.push(updateFirstName());
      }
      if (formData.lname !== user.lname) {
        updates.push(updateLastName());
      }
      if (formData.username !== user.username) {
        updates.push(updateUsername());
      }
      if (formData.mail !== user.mail) {
        updates.push(updateMail());
      }
      if (changePassword && formData.newPassword) {
        updates.push(updatePassword());
      }

      await Promise.all(updates);

      const updatedUser = {
        ...user,
        fname: formData.fname,
        lname: formData.lname,
        username: formData.username,
        mail: formData.mail,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      alert("Profil je uspešno ažiriran");

      setEditing(false);
      setChangePassword(false);
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      console.error("Greska pri azuriranju profila: ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFirstName = async () => {
    const response = await fetch(`${API_URL}/users/${user.user_id}/firstname`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fname: formData.fname }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Greska pri azuriranju imena");
    }

    return response.json();
  };

  const updateLastName = async () => {
    const response = await fetch(`${API_URL}/users/${user.user_id}/lastname`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lname: formData.lname }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Greska pri azuriranju prezimena");
    }

    return response.json();
  };

  const updateUsername = async () => {
    const response = await fetch(`${API_URL}/users/${user.user_id}/username`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: formData.username }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Greska pri azuriranju korisnickog imena",
      );
    }

    return response.json();
  };

  const updateMail = async () => {
    const response = await fetch(`${API_URL}/users/${user.user_id}/mail`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mail: formData.mail }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Greska pri azuriranju e-maila");
    }

    return response.json();
  };

  const updatePassword = async () => {
    const loginResponse = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        password: formData.oldPassword,
      }),
    });

    if (!loginResponse.ok) {
      throw new Error("Stara lozinka nije tacna");
    }

    const response = await fetch(`${API_URL}/users/${user.user_id}/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: formData.newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Greska pri azuriranju lozinke");
    }

    return response.json();
  };

  const handleCancel = () => {
    setEditing(false);
    setChangePassword(false);
    setError(null);
    setFormData({
      fname: user?.fname || "",
      lname: user?.lname || "",
      username: user?.username || "",
      mail: user?.mail || "",
      oldPassword: "",
      newPassword: "",
    });
  };

  return (
    <div>
      <h2 className="edit-profile-title">Moj profil</h2>
      {error && <p className="error-message">{error}</p>}
      <form action="" className="edit-form" onSubmit={handleSubmit}>
        <div className={editing ? "edit-input editing" : "edit-input viewing"}>
          {editing ? (
            <input
              type="text"
              /*defaultValue={user?.fname || ""}*/
              disabled={!editing}
              name="fname"
              value={formData.fname}
              onChange={handleInputChange}
              placeholder="Ime"
            />
          ) : (
            <div className="edit-info-div">
              {" "}
              <span>Ime:</span> <span>{user?.fname || ""}</span>
            </div>
          )}
        </div>
        <div className={editing ? "edit-input editing" : "edit-input viewing"}>
          {editing ? (
            <input
              type="text"
              //defaultValue={user?.lname || ""}
              disabled={!editing}
              name="lname"
              value={formData.lname}
              onChange={handleInputChange}
              placeholder="Prezime"
            />
          ) : (
            <div className="edit-info-div">
              {" "}
              <span>Prezime:</span> <span>{user?.lname || ""}</span>
            </div>
          )}
        </div>
        <div className={editing ? "edit-input editing" : "edit-input viewing"}>
          {editing ? (
            <input
              type="text"
              //defaultValue={user?.username || ""}
              disabled={!editing}
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Korisničko ime"
            />
          ) : (
            <div className="edit-info-div">
              {" "}
              <span>Korisničko ime:</span> <span>{user?.username || ""}</span>
            </div>
          )}
        </div>
        <div className={editing ? "edit-input editing" : "edit-input viewing"}>
          {editing ? (
            <input
              type="email"
              //defaultValue={user?.mail || ""}
              disabled={!editing}
              name="mail"
              value={formData.mail}
              onChange={handleInputChange}
              placeholder="E-mail"
            />
          ) : (
            <div className="edit-info-div">
              {" "}
              <span>Email:</span> <span>{user?.mail || ""}</span>
            </div>
          )}
        </div>
        <div className="change-password">
          {/*<button
            className="edit-button change-password-button"
            onClick={() => setChangePassword((prev) => !prev)}
          >
            {changePassword ? "Odustani" : "Promeni lozinku"}
          </button>*/}

          {!changePassword && editing && (
            <span className="change-password-span">
              Da li želite da promenite lozinku?{" "}
              <span
                className="change-password-btn"
                onClick={() => setChangePassword(true)}
              >
                Promeni
              </span>
            </span>
          )}
          {changePassword && (
            <div className="edit-passwords-div">
              <div className="edit-input password">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Stara lozinka"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                />
                <img
                  src={showPassword ? assets.hide : assets.show}
                  alt=""
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              </div>
              <div className="edit-input password">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Nova lozinka"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
                <img
                  src={showNewPassword ? assets.hide : assets.show}
                  alt=""
                  onClick={() => setShowNewPassword((prev) => !prev)}
                />
              </div>
            </div>
          )}
        </div>

        {editing && (
          <div className="edit-buttons-div">
            <button type="submit" className="edit-button">
              Izmeni
            </button>
            <button
              className="edit-button"
              onClick={() => {
                handleCancel();
              }}
            >
              Odustani
            </button>
          </div>
        )}
      </form>
      {!editing && (
        <button className="edit-button" onClick={() => setEditing(true)}>
          Izmeni profil
        </button>
      )}
    </div>
  );
};

export default EditProfile;
