import React from "react";
import Header from "../../components/Header/Header";
import PopularGames from "../../components/PopularGames/PopularGames";
import Setup from "../../components/Setup/Setup";

const Home = () => {
  return (
    <div>
      <Header />
      <PopularGames />
      <Setup />
    </div>
  );
};

export default Home;
