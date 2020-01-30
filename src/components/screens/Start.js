import MainMenu from "./../menu/MainMenu";
import React from "react";
import titleCard from "./../../assets/images/title_card.png";

const fullscreen = document.fullscreenEnabled ? ["fullscreen"] : [];
const menuItems = ["play", "highscoreView", "about", "sound", ...fullscreen];

const Start = () => (
  <>
    <img className="title-card" alt="Linnr - it's not snake" src={titleCard} />
    <MainMenu filter={menuItems} />
  </>
);

export default Start;
