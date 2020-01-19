import "./styles/app.css";

import React, { useEffect, useRef } from "react";
import { soundDisable, soundEnable } from "./redux/settings";
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
  let { game, worm, settings } = useSelector(state => state);

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
              {/* {worm.dead === true ? (
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
              ) : null} */}
              <Game />
              <div className="gamebar">
                <div className="highscore">
                  <span role="img" aria-label="highscore">
                    🍄
                  </span>{" "}
                  {worm.food}
                </div>

                {worm.dead === true ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div />
                    <div />
                  </>
                )}
                <button
                  className={`sound ${
                    settings.soundOn ? "" : "disabled"
                  }`.trim()}
                  onClick={() =>
                    settings.soundOn === true
                      ? dispatch(soundDisable())
                      : dispatch(soundEnable())
                  }
                >
                  <span role="img" aria-label="toggle sound">
                    💤
                  </span>
                </button>
              </div>
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
