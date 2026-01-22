import React, { useState } from "react";
import "./SelectionSetup.css";
import { setup_list } from "../../assets/assets";
import SelectionSetupItem from "../SelectionSetupItem/SelectionSetupItem";
import SelectionTerm from "../SelectionTerm/SelectionTerm";
import SelectionDate from "../SelectionDate/SelectionDate";

const SelectionSetup = () => {
  const [step, setStep] = useState(1);
  const [setupId, setSetupId] = useState(null);
  return (
    <>
      {step == 1 && (
        <div>
          <h1 className="selection-setup-title">Odaberi svoj setup</h1>
          {setup_list.map((setup, index) => {
            return (
              <SelectionSetupItem
                key={index}
                setup={setup}
                setStep={setStep}
                setSetupId={setSetupId}
              />
            );
          })}
        </div>
      )}
      {step == 2 && <SelectionTerm setupId={setupId} setStep={setStep} />}
      {step == 3 && <SelectionDate />}
    </>
  );
};

export default SelectionSetup;
