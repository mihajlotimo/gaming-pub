import React from "react";
import "./WorkTime.css";

const WorkTime = ({ centrirano }) => {
  return (
    <div className="worktime">
      <h2 style={centrirano && { textAlign: "center" }}>Radno Vreme</h2>
      <div
        className="worktime-container"
        style={centrirano && { margin: "30px auto 0" }}
      >
        <div className="time">
          <span>Ponedeljak - Petak: </span>
          <span>12:00 - 22:00</span>
        </div>
        <div className="time">
          <span>Subota: </span>
          <span>10:00 - 23:00</span>
        </div>
        <div className="time">
          <span>Nedelja: </span>
          <span>Ne radimo</span>
        </div>
      </div>
    </div>
  );
};

export default WorkTime;
