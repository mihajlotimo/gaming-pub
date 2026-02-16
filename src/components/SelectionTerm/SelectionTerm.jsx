import React, { useState, useEffect } from "react";
import "./SelectionTerm.css";
const API_URL = import.meta.env.VITE_API_URL;

const SelectionTerm = ({ setupId, setStep, setDuration }) => {
  const [setupInfo, setSetupInfo] = useState(null);
  const [check, setCheck] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetups = async () => {
      try {
        const response = await fetch(`${API_URL}/setups`);
        const data = await response.json();
        const setup = data.find((s) => s.id === setupId);
        setSetupInfo(setup);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching setup:", err);
        setLoading(false);
      }
    };

    if (setupId) {
      fetchSetups();
    }
  }, [setupId]);

  const terms = [
    { label: "1 sat", hours: 1 },
    { label: "2 sata", hours: 2 },
    { label: "3 sata", hours: 3 },
    { label: "5 sati", hours: 5 },
    { label: "ceo dan", hours: 8 },
  ];

  const handleNext = () => {
    if (check) {
      setDuration(check);
      setStep(3);
    }
  };

  if (loading) return <div>Loading...</div>;
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
                {setupInfo.basePrice * term.hours} rsd
              </span>
            </div>
            <div className="check">
              {check === term.hours && <div className="checkmark"></div>}
            </div>
          </div>
        ))}
        <button onClick={handleNext} className="terms-button" disabled={!check}>
          Dalje
        </button>
      </div>
    </div>
  );
};

export default SelectionTerm;
