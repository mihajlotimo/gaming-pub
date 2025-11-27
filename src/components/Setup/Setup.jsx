import React from "react";
import "./Setup.css";
import { setup_list } from "../../assets/assets";
import SetupItem from "../SetupItem/SetupItem";

const Setup = () => {
  return (
    <div className="setup-display">
      <h2>Naša oprema</h2>
      <div className="setup-display-list">
        {setup_list.map((item, index) => {
          return (
            <SetupItem
              key={index}
              id={item._id}
              name={item.name}
              image={item.image}
              description={item.description}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Setup;
