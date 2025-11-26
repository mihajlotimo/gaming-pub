import React from "react";
import "./GameItem.css";

const GameItem = ({ id, name, image, description }) => {
  return (
    <div className="game-item">
      <div className="game-item-image-container">
        <img className="game-item-image" src={image} alt="" />
      </div>
      <div className="game-item-info">
        <p className="game-item-name">{name}</p>
        <p className="game-item-desc">{description}</p>
      </div>
    </div>
  );
};

export default GameItem;
