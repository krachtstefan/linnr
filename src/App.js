import "./styles/app.css";

import React, { useEffect, useRef } from "react";
import { startGame, stopGame } from "./redux/game";
import { useDispatch, useSelector } from "react-redux";

import Debugger from "./components/Debugger";
import Dpad from "./components/Dpad";
import Game from "./components/Game";
import { resetWorm } from "./redux/worm";

let App = () => {
  const dispatch = useDispatch();
  const restartButton = useRef();
  const startButton = useRef();
  let { game, worm } = useSelector(state => state);

  useEffect(() => {
    if (restartButton.current) {
      restartButton.current.focus();
    }
  }, [worm.dead]);

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
            <>
              {worm.dead === true ? (
                <div className="game-menu">
                  <button
                    ref={restartButton}
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
