import person from "./person.png";
import logo from "./logo.png";
import game_1 from "./game_1.jpg";
import game_2 from "./game_2.jpg";
import game_3 from "./game_3.jpg";
import game_4 from "./game_4.jpg";
import game_5 from "./game_5.jpg";
import game_6 from "./game_6.jpg";
import facebook_icon from "./facebook.png";
import instagram_icon from "./instagram.png";
import linkedin_icon from "./linkedin.png";
import setup_1 from "./setup_1.jpg";
import setup_2 from "./setup_2.jpg";
import setup_3 from "./setup_3.jpg";
import hide from "./hide.png";
import show from "./eye.png";

export const assets = {
  person,
  logo,
  facebook_icon,
  instagram_icon,
  linkedin_icon,
  hide,
  show,
};

export const game_list = [
  {
    _id: "1",
    name: "Counter Strike 2",
    image: game_1,
    description:
      "Najbolji taktički FPS gde brzina reakcije i timska igra odlučuju pobednika.",
  },
  {
    _id: "2",
    name: "Fortnite",
    image: game_2,
    description:
      "Dinamična battle royale akcija sa gradnjom, šarenim svetom i konstantnim izazovima.",
  },
  {
    _id: "3",
    name: "Valorant",
    image: game_3,
    description:
      "Precizan taktički shooter koji spaja CS stil pucanja sa jedinstvenim moćima agenata.",
  },
  {
    _id: "4",
    name: "EA FC 25",
    image: game_4,
    description:
      "Najrealističniji fudbalski doživljaj sa brzim mečevima i kompetitivnom atmosferom.",
  },
  {
    _id: "5",
    name: "GTA V",
    image: game_5,
    description:
      "Otvoren svet pun akcije, misija i beskrajnih mogućnosti za zabavu sa ekipom.",
  },
  {
    _id: "5",
    name: "League of Legends",
    image: game_6,
    description:
      "Najpoznatija igra gde strategija, timski rad i pravi izbor heroja odlučuju ishod borbe.",
  },
];

export const setup_list = [
  {
    _id: "1",
    name: "PC Računari",
    image: setup_1,
    description:
      "Profesionalni gejming PC računari sa brzim monitorima, udobnim perifernim uređajima i stabilnom mrežnom vezom.",
    price: 300,
  },
  {
    _id: "2",
    name: "PlayStation",
    image: setup_2,
    description:
      "PlayStation gejming zona sa velikim ekranima i udobnim sedenjem, savršena za sportske igre, trke i multiplayer zabavu.",
    price: 500,
  },
  {
    _id: "3",
    name: "Moto Simulator (Gaming stolica)",
    image: setup_3,
    description:
      "Realistična moto sim-racing stolica sa upravljačima i pedalama, dizajnirana da pruži potpuno uranjajuće iskustvo vožnje.",
    price: 800,
  },
];

export const price_list = [
  {
    name: "PC Računari",
    basePrice: 300,
    promotions: [
      { duration: "3 sata", price: 800 },
      { duration: "5 sati", price: 1200 },
      { duration: "Ceo dan", price: 1800 },
    ],
  },
  {
    name: "PlayStation",
    basePrice: 500,
    promotions: [
      { duration: "3 sata", price: 1350 },
      { duration: "5 sati", price: 2000 },
      { duration: "Ceo dan", price: 2800 },
    ],
  },
  {
    name: "Moto Simulator (Gaming stolica)",
    basePrice: 800,
    promotions: [
      { duration: "3 sata", price: 2100 },
      { duration: "5 sati", price: 3300 },
      { duration: "Ceo dan", price: 4500 },
    ],
  },
];
