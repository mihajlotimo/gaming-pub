import React from "react";
import "./Reservation.css";
import SelectionSetup from "../../components/SelectionSetup/SelectionSetup";

const Reservation = ({ user }) => {
  return (
    <div className="selection-page">
      <SelectionSetup user={user} />
    </div>
  );
};

export default Reservation;
