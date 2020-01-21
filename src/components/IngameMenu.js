import React, { useRef } from "react";
import { soundDisable, soundEnable } from "../redux/settings";
import { useDispatch, useSelector } from "react-redux";

import { placeItems } from "../redux/stage";
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
      {worm.dead === true ? (
        <>
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
