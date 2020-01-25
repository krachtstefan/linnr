import "./styles/app.css";

import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";

import Credits from "./components/screens/Credits";
import GAListener from "./components/utils/GAListener";
import Game from "./components/screens/Game";
import HighscoreForm from "./components/screens/HighscoreForm";
import HighscoreList from "./components/screens/HighscoreList";
import React from "react";
import Start from "./components/screens/Start";
import { config } from "./config";

let App = () => (
  <Router>
    <GAListener trackingId={config.ga.trackingId} deactivate={config.isDev}>
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
            <Route path={config.navigation.credits} children={<Credits />} />
            <Route path={config.navigation.start} children={<Start />} />
          </Switch>
        </div>
      </div>
    </GAListener>
  </Router>
);

export default App;
