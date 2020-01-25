import React, { useEffect, useRef, useState } from "react";
import { soundDisable, soundEnable } from "../../redux/settings";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { config } from "../../config";
import { placeItems } from "../../redux/stage";
import { resetWorm } from "../../redux/worm";

const IngameMenu = () => {
  const { settings, worm } = useSelector(state => state);
  const resetButton = useRef();
  const dispatch = useDispatch();
  const [highscoreChanged, setHighscoreChanged] = useState(false);

  useEffect(() => {
    if (worm.highscore > 0) {
      setHighscoreChanged(true);
      const timer = setTimeout(() => {
        setHighscoreChanged(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [worm.highscore]);

  return (
    <div className="gamebar">
      <div>
        <span role="img" aria-label="highscore">
          🍄
        </span>{" "}
        <span className={`highscore ${highscoreChanged ? "changing" : ""}`}>
          {worm.highscore}
        </span>
      </div>
      {worm.dead === true ? (
        <>
          <Link to={config.navigation.submitHighscore}>submit highscore</Link>
          <button
            ref={resetButton}
            onClick={() => {
              dispatch(resetWorm());
              dispatch(placeItems("obstacle"));
              dispatch(placeItems("food"));
            }}
          >
            reset
          </button>
          <button onClick={() => dispatch(resetWorm())}>retry</button>
          <Link to={() => config.navigation.start}>quit</Link>
        </>
      ) : (
        <>
          <div />
          <div />
          <div />
          <div />
        </>
      )}
      <button
        className={`sound ${settings.soundOn ? "" : "disabled"}`.trim()}
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
  );
};

export default IngameMenu;
