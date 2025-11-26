import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Rezervišite svoj termin na vreme</h2>
        <p>
          Izaberite najbolje igre na PC-ju, PlayStation-u ili Xbox-u, okupite
          ekipu i uživajte u vrhunskom gaming iskustvu uz atmosferu koja podiže
          adrenalin.
        </p>
        <button>Rezerviši</button>
      </div>
    </div>
  );
};

export default Header;
