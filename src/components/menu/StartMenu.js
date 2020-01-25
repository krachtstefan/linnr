import { Link } from "react-router-dom";
import React from "react";
import { config } from "./../../config";

const StartMenu = () => (
  <div className="start-menu">
    <Link to={config.navigation.play}>play</Link>
    <Link to={config.navigation.highscore}>highscore</Link>
  </div>
);

export default StartMenu;
