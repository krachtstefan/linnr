import MainMenu from "./../menu/MainMenu";
import React from "react";

const fullscreen = document.fullscreenEnabled ? ["fullscreen"] : [];
const menuItems = ["play", "highscoreView", "about", "sound", ...fullscreen];

const Start = () => <MainMenu filter={menuItems} />;

export default Start;
