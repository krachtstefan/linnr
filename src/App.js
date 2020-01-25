import "./styles/app.css";

import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";

import Game from "./components/Game";
import HighscoreForm from "./components/highscore/HighscoreForm";
import HighscoreList from "./components/highscore/HighscoreList";
import React from "react";
import StartMenu from "./components/menu/StartMenu";
import { config } from "./config";

let App = () => (
  <Router>
    <div className="logo">
      <Link to={config.navigation.start} className="logo"></Link>
    </div>
    <div className="game">
      <div className="game-container">
        <Switch>
          <Route
            path={config.navigation.highscore}
            children={<HighscoreList />}
          />
          <Route
            path={config.navigation.submitHighscore}
            children={<HighscoreForm />}
          />
          <Route path={config.navigation.play} children={<Game />} />
          <Route path={config.navigation.start} children={<StartMenu />} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;
