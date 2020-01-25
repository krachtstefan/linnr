import React from "react";
import { showHighscore } from "../../redux/highscore";
import { startGame } from "../../redux/game";
import { useDispatch } from "react-redux";

const StartMenu = () => {
  const dispatch = useDispatch();
  return (
    <div className="start-menu">
      <button onClick={() => dispatch(startGame())}>play</button>
      <button onClick={() => dispatch(showHighscore())}>highscore</button>
    </div>
  );
};

export default StartMenu;
