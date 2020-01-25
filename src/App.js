import "./styles/app.css";

import { Link, BrowserRouter as Router } from "react-router-dom";

import Game from "./components/Game";
import HighscoreForm from "./components/highscore/HighscoreForm";
import HighscoreList from "./components/highscore/HighscoreList";
import React from "react";
import StartMenu from "./components/menu/StartMenu";
import { config } from "./config";
import { useSelector } from "react-redux";

let App = () => {
  let { game, highscore } = useSelector(state => state);

  return (
    <Router>
      <div className="logo">
        <Link to={config.navigation.start} className="logo"></Link>
      </div>
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
              return <StartMenu />;
            }
            return <Game />;
          })()}
        </div>
      </div>
    </Router>
  );
};

export default App;
