import React from "react";
import "./SelectionDate.css";
import Calendar from "react-calendar";

const SelectionDate = () => {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 14);
  return (
    <div className="selection-date">
      <Calendar
        minDate={today}
        maxDate={maxDate}
        className={"calendar"}
        prev2Label={null}
        next2Label={null}
        minDetail="month"
        maxDetail="month"
      />
    </div>
  );
};

export default SelectionDate;
