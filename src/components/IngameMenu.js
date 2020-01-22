import React, { useEffect, useRef, useState } from "react";
import { soundDisable, soundEnable } from "../redux/settings";
import { useDispatch, useSelector } from "react-redux";

import { placeItems } from "../redux/stage";
import { resetWorm } from "../redux/worm";
import { showHighscoreForm } from "../redux/highscore";
import { stopGame } from "../redux/game";

const IngameMenu = () => {
  const { settings, worm } = useSelector(state => state);
  const resetButton = useRef();
  const dispatch = useDispatch();
  const [highscoreChanged, setHighscoreChanged] = useState(false);

  useEffect(() => {
    if (worm.food > 0) {
      setHighscoreChanged(true);
      const timer = setTimeout(() => {
        setHighscoreChanged(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [worm.food]);

  return (
    <div className="gamebar">
      <div>
        <span role="img" aria-label="highscore">
          🍄
        </span>{" "}
        <span className={`highscore ${highscoreChanged ? "changing" : ""}`}>
          {worm.food}
        </span>
      </div>
      {worm.dead === true ? (
        <>
          <button
            ref={resetButton}
            onClick={() => {
              dispatch(stopGame());
              dispatch(placeItems("obstacle"));
              dispatch(placeItems("food"));
              dispatch(showHighscoreForm());
            }}
          >
            submit Highscore
          </button>

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
          <button
            onClick={() => {
              dispatch(resetWorm());
              dispatch(placeItems("food"));
            }}
          >
            retry
          </button>
          <button
            onClick={() => {
              dispatch(stopGame());
              dispatch(resetWorm());
              dispatch(placeItems("obstacle"));
              dispatch(placeItems("food"));
            }}
          >
            quit
          </button>
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
