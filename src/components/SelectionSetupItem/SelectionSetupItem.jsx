import React from "react";
import "./SelectionSetupItem.css";
import { assets } from "../../assets/assets";

const SelectionSetupItem = ({ setup, setStep, setSetupId }) => {
  return (
    <div
      className="selection-setup-item"
      onClick={() => {
        (setStep(2), setSetupId(setup._id));
      }}
    >
      <div className="selection-setup-item-info">
        <img src={setup.image} alt="" className="setup-image" />
        <div className="setup-desc">
          <span className="setup-name">{setup.name}</span>
          <span className="setup-description">{setup.description}</span>
        </div>
      </div>

      <img src={assets.arrow} alt="" className="arrow" />
    </div>
  );
};

export default SelectionSetupItem;
