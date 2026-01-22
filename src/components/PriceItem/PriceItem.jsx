import React from "react";
import "./PriceItem.css";
import { useNavigate } from "react-router-dom";

const PriceItem = ({ name, basePrice, promotions }) => {
  const navigate = useNavigate();
  return (
    <div className="price-card">
      <h2>{name}</h2>
      <p className="base-price">
        Standardna cena: <span>{basePrice} RSD / sat</span>
      </p>
      <h3>Promocije</h3>
      <ul>
        {promotions.map((item, index) => {
          return (
            <li key={index}>
              {item.duration}: <span>{item.price} RSD</span>
            </li>
          );
        })}
      </ul>
      <button
        onClick={() => {
          navigate("/rezervacija");
        }}
      >
        Rezerviši
      </button>
    </div>
  );
};

export default PriceItem;
