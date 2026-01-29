import React, { useEffect, useState } from "react";
import "./Setup.css";
import SetupItem from "../SetupItem/SetupItem";
const API_URL = import.meta.env.VITE_API_URL;

const Setup = ({ setMenu }) => {
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
    <div className="setup-display">
      <h2>Naša oprema</h2>
      <div className="setup-display-list">
        {setups.map((item, index) => {
          return (
            <SetupItem
              key={index}
              id={item.id}
              name={item.name}
              image={item.image}
              description={item.description}
              price={item.basePrice}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Setup;
