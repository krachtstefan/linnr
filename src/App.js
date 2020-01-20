import "./styles/app.css";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Debugger from "./components/Debugger";
import Dpad from "./components/Dpad";
import Game from "./components/Game";
import { startGame } from "./redux/game";

let App = () => {
  const dispatch = useDispatch();
  const startButton = useRef();
  let { game } = useSelector(state => state);

  useEffect(() => {
    if (startButton.current) {
      startButton.current.focus();
    }
  }, [startButton, game.isRunning]);

  return (
    <>
      <div className="logo"></div>
      <div className="game">
        <div className="game-container">
          {game.isRunning === false ? (
            <div className="game-menu">
              <button
                ref={startButton}
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
