import "./styles/app.css";

import { useDispatch, useSelector } from "react-redux";

import Debugger from "./components/Debugger";
import Dpad from "./components/Dpad";
import Game from "./components/Game";
import React from "react";
import { startGame } from "./redux/game";

let App = () => {
  const dispatch = useDispatch();
  let { game } = useSelector(state => state);
  return (
    <>
      <div className="logo"></div>
      <div className="game">
        <div className="game-container">
          {game.isRunning === false ? (
            <div className="game-menu">
              <button
                onClick={() => {
                  dispatch(startGame());
                }}
              >
                PLAY
              </button>
            </div>
          ) : (
            <Game />
          )}
        </div>
        <Dpad />
      </div>
      <Debugger />
    </>
  );
};

export default App;
