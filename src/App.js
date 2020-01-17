import "./styles/app.css";

import { startGame, stopGame } from "./redux/game";
import { useDispatch, useSelector } from "react-redux";

import Debugger from "./components/Debugger";
import Dpad from "./components/Dpad";
import Game from "./components/Game";
import React from "react";
import { resetWorm } from "./redux/worm";

let App = () => {
  const dispatch = useDispatch();
  let { game, worm } = useSelector(state => state);
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
            <>
              {worm.dead === true ? (
                <div className="game-menu">
                  <button
                    onClick={() => {
                      dispatch(resetWorm());
                    }}
                  >
                    RESTART
                  </button>
                  <button
                    onClick={() => {
                      dispatch(stopGame());
                      dispatch(resetWorm());
                    }}
                  >
                    QUIT
                  </button>
                </div>
              ) : null}
              <Game />
            </>
          )}
        </div>
        <Dpad />
      </div>
      <Debugger />
    </>
  );
};

export default App;
