import React from "react";
import "./Prices.css";
import { price_list } from "../../assets/assets";
import PriceItem from "../../components/PriceItem/PriceItem";

const Prices = () => {
  return (
    <div className="prices">
      {price_list.map((item, index) => {
        return (
          <PriceItem
            name={item.name}
            basePrice={item.basePrice}
            promotions={item.promotions}
          />
        );
      })}
    </div>
  );
};

export default Prices;
