import React, { useRef } from "react";
import { placeItems, placeObstacles } from "../redux/stage";
import { soundDisable, soundEnable } from "../redux/settings";
import { useDispatch, useSelector } from "react-redux";

import { resetWorm } from "../redux/worm";
import { stopGame } from "../redux/game";

const IngameMenu = () => {
  const { settings, worm } = useSelector(state => state);
  const resetButton = useRef();
  const dispatch = useDispatch();
  return (
    <div className="gamebar">
      <div className="highscore">
        <span role="img" aria-label="highscore">
          🍄
        </span>{" "}
        {worm.food}
      </div>
      {worm.dead === true || true ? (
        <>
          <button
            ref={resetButton}
            onClick={() => {
              dispatch(resetWorm());
              dispatch(placeObstacles());
              dispatch(placeItems("food"));
            }}
          >
            reset
          </button>
          <button onClick={() => dispatch(resetWorm())}>retry</button>
          <button
            onClick={() => {
              dispatch(stopGame());
              dispatch(resetWorm());
              dispatch(placeObstacles());
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
