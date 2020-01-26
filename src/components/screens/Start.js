import MainMenu from "./../menu/MainMenu";
import React from "react";

const Start = () => (
  <MainMenu filter={["play", "highscoreView", "credits", "sound"]} />
);

export default Start;
