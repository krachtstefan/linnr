import "./styles/app.css";

import { Link, Route, Switch, useLocation } from "react-router-dom";
import React, { useEffect } from "react";

import Credits from "./components/screens/Credits";
import GAListener from "./components/utils/GAListener";
import Game from "./components/screens/Game";
import HighscoreForm from "./components/screens/HighscoreForm";
import HighscoreList from "./components/screens/HighscoreList";
import Notifications from "./components/utils/Notifications";
import Start from "./components/screens/Start";
import { config } from "./config";
import { getHighscore } from "./redux/highscore";
import { useDispatch } from "react-redux";

let App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.className = location.pathname.substring(1); // remove the / from the path
  }, [location]);

  useEffect(() => {
    dispatch(getHighscore());
  }, [dispatch]);

  return (
    <GAListener trackingId={config.ga.trackingId} deactivate={config.isDev}>
      <div className="logo">
        <Link to={config.navigation.start} className="logo"></Link>
      </div>
      <div className="main">
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
            <Route path={config.navigation.about} children={<Credits />} />
            <Route path={config.navigation.start} children={<Start />} />
          </Switch>
        </div>
      </div>
      <Notifications />
    </GAListener>
  );
};

export default App;
