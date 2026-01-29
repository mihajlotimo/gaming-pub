import React, { useEffect, useState } from "react";
import "./Games.css";
import GameItem from "../../components/GameItem/GameItem";
const API_URL = import.meta.env.VITE_API_URL;

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_URL}/games`);
        const data = await response.json();
        setGames(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <div>Loading games...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="games-display">
      {/*<h2>Popularne igre</h2>*/}
      <div className="games-display-list">
        {games.map((item, index) => {
          return (
            <GameItem
              key={index}
              id={item.game_id}
              name={item.name}
              image={item.image}
              description={item.description}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Games;
