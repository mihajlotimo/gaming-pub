import React from "react";
import "./CallToAction.css";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <div className="call-to-action">
      <h2>Spreman za igru?</h2>
      <p>Rezerviši svoj termin i pridruži se najboljoj gaming ekipi u gradu.</p>
      <button
        onClick={() => {
          navigate("/rezervacija");
        }}
      >
        Rezerviši sada
      </button>
    </div>
  );
};

export default CallToAction;
