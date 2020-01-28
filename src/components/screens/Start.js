import MainMenu from "./../menu/MainMenu";
import React from "react";

const Start = () => (
  <MainMenu filter={["play", "highscoreView", "about", "sound"]} />
);

export default Start;
