import React, { useState, useEffect } from "react";
import "./SelectionSetup.css";
import SelectionSetupItem from "../SelectionSetupItem/SelectionSetupItem";
import SelectionTerm from "../SelectionTerm/SelectionTerm";
import SelectionDate from "../SelectionDate/SelectionDate";
const API_URL = import.meta.env.VITE_API_URL;

const SelectionSetup = () => {
  const [step, setStep] = useState(1);
  const [setupId, setSetupId] = useState(null);
  const [setups, setSetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSetups = async () => {
      try {
        const response = await fetch(`${API_URL}/setups`);
        const data = await response.json();
        setSetups(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSetups();
  }, []);

  if (loading) return <div>Loading setups...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="selection-setup">
      {step == 1 && (
        <div>
          <h1 className="selection-setup-title">Odaberi svoj setup</h1>
          {setups.map((setup, index) => {
            return (
              <SelectionSetupItem
                key={index}
                setup={{
                  _id: setup.id,
                  name: setup.name,
                  image: setup.image,
                  description: setup.description,
                  basePrice: setup.basePrice,
                  available: setup.available,
                }}
                setStep={setStep}
                setSetupId={setSetupId}
              />
            );
          })}
        </div>
      )}
      {step == 2 && <SelectionTerm setupId={setupId} setStep={setStep} />}
      {step == 3 && <SelectionDate />}
    </div>
  );
};

export default SelectionSetup;
