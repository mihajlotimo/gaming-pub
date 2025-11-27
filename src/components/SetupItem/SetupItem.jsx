import React from "react";
import "./SetupItem.css";

const SetupItem = ({ id, name, image, description }) => {
  return (
    <div className="setup-item" style={{ backgroundImage: `url(${image})` }}>
      <div className="setup-item-containter">
        <p className="setup-name">{name}</p>
        <p className="setup-desc">{description}</p>
        <button className="setup-btn">Rezervisi</button>
      </div>
    </div>
  );
};

export default SetupItem;
