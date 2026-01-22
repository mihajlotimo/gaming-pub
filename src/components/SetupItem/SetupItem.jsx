import React from "react";
import "./SetupItem.css";
import { useNavigate } from "react-router-dom";

const SetupItem = ({ id, name, image, description, price }) => {
  const navigate = useNavigate();
  return (
    <div className="setup-item" style={{ backgroundImage: `url(${image})` }}>
      <div className="setup-item-containter">
        <p className="setup-name">{name}</p>
        <p className="setup-desc">{description}</p>
        <div className="setup-price">{price} RSD / sat</div>
        <button
          className="setup-btn"
          onClick={() => {
            navigate("rezervacija");
          }}
        >
          Rezervisi
        </button>
      </div>
    </div>
  );
};

export default SetupItem;
