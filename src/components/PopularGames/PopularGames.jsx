import React from "react";
import "./PopularGames.css";
import { game_list } from "../../assets/assets";
import GameItem from "../GameItem/GameItem";

const PopularGames = () => {
  return (
    <div className="games-display">
      <h2>Popularne igre</h2>
      <div className="games-display-list">
        {game_list.map((item, index) => {
          return (
            <GameItem
              key={index}
              id={item._id}
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

export default PopularGames;
