import React from "react";
import Header from "../../components/Header/Header";
import PopularGames from "../../components/PopularGames/PopularGames";
import Setup from "../../components/Setup/Setup";
import WorkTime from "../../components/WorkTime/WorkTime";

const Home = ({ setMenu }) => {
  return (
    <div>
      <Header />
      <PopularGames />
      <Setup />
      <WorkTime />
    </div>
  );
};

export default Home;
