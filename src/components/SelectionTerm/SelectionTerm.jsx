import React, { useState } from "react";
import "./SelectionTerm.css";
import { setup_list } from "../../assets/assets";

const SelectionTerm = ({ setupId, setStep }) => {
  const setupInfo = setup_list.find((setup) => setup._id === setupId);
  const [check, setCheck] = useState(null);

  const terms = [
    { label: "1 sat", hours: 1 },
    { label: "2 sata", hours: 2 },
    { label: "3 sata", hours: 3 },
    { label: "5 sati", hours: 5 },
    { label: "ceo dan", hours: 8 },
  ];

  if (!setupInfo) return null;
  return (
    <div className="selection-term">
      <img src={setupInfo.image} alt="" className="term-setup-image" />
      <span className="term-setup-name">{setupInfo.name}</span>
      <div className="terms">
        {terms.map((term, index) => (
          <div
            className="term-item"
            key={index}
            onClick={() => {
              setCheck(term.hours);
            }}
          >
            <div className="term-item-price">
              <span className="term-item-price-label">{term.label}</span>{" "}
              <span className="term-item-price-amount">
                {setupInfo.price * term.hours} rsd
              </span>
            </div>
            <div className="check">
              {check === term.hours && <div className="checkmark"></div>}
            </div>
          </div>
        ))}
        <button onClick={() => setStep(3)} className="terms-button">
          Dalje
        </button>
      </div>
    </div>
  );
};

export default SelectionTerm;
