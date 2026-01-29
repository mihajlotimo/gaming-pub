import React, { useEffect, useState } from "react";
import "./Prices.css";
import PriceItem from "../../components/PriceItem/PriceItem";
const API_URL = import.meta.env.VITE_API_URL;

const Prices = ({ setMenu }) => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(`${API_URL}/promotions`);
        const data = await response.json();
        setPrices(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  if (loading) return <div>Loading prices...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="prices">
      {prices.map((item, index) => {
        return (
          <PriceItem
            key={index}
            name={item.name}
            basePrice={item.basePrice}
            image={item.image}
            promotions={item.promotions}
          />
        );
      })}
    </div>
  );
};

export default Prices;
