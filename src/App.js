import "./styles/app.css";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Debugger from "./components/Debugger";
import Dpad from "./components/Dpad";
import Game from "./components/Game";
import HighscoreForm from "./components/highscore/HighscoreForm";
import HighscoreList from "./components/highscore/HighscoreList";
import { showHighscore } from "./redux/highscore";
import { startGame } from "./redux/game";

let App = () => {
  const dispatch = useDispatch();
  const startButton = useRef();
  let { game, highscore } = useSelector(state => state);

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
          {(() => {
            if (highscore.showList === true) {
              return <HighscoreList />;
            }
            if (highscore.showForm === true) {
              return <HighscoreForm />;
            }

            if (game.isRunning === false) {
              return (
                <div className="game-menu">
                  <button
                    ref={startButton}
                    onClick={() => dispatch(startGame())}
                  >
                    play
                  </button>

                  <button onClick={() => dispatch(showHighscore())}>
                    highscore
                  </button>
                </div>
              );
            }
            return <Game />;
          })()}
        </div>
      </div>
      {/* <Debugger /> */}
    </>
  );
};

export default App;
