import React, { useEffect, useState } from "react";
import { soundDisable, soundEnable } from "../../redux/settings";
import { useDispatch, useSelector } from "react-redux";

import MainMenu from "./MainMenu";
import { config } from "../../config";
import { highscorePosSelector } from "../../redux/highscore";
import useKeyPress from "../../hooks/use-keypress";

const IngameMenu = () => {
  const { settings, worm } = useSelector(state => state);
  const { Space: space } = useKeyPress(["Space"]);
  const dispatch = useDispatch();
  const [highscoreChanged, setHighscoreChanged] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [posChanged, setPosChanged] = useState(false);
  const highscorePos = useSelector(state => highscorePosSelector(state));

  useEffect(() => {
    if (worm.highscore > 0) {
      setHighscoreChanged(true);
      const timer = setTimeout(() => {
        setHighscoreChanged(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [worm.highscore]);

  useEffect(() => {
    setPosChanged(true);
    const timer = setTimeout(() => {
      setPosChanged(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [highscorePos]);

  useEffect(() => {
    if (space === true) {
      setShowMenu(worm.dead === true);
    }
  }, [worm.dead, space]);

  useEffect(() => {
    if (worm.dead === false) {
      setShowMenu(false);
    }
  }, [worm.dead]);

  return (
    <>
      {(() => {
        const submitScore = worm.highscore > 0 ? ["highscoreSubmit"] : [];
        return showMenu ? (
          <MainMenu
            filter={[
              "retry",
              "reset",
              ...submitScore,
              "highscoreView",
              "credits",
              "quit",
              "sound"
            ]}
          />
        ) : null;
      })()}
      <div className="gamebar">
        <div className="score-info">
          <div>
            <span role="img" aria-label="highscore">
              🍄
            </span>{" "}
            <span
              className={`current-highscore ${
                highscoreChanged ? "changing" : ""
              }`}
            >
              {worm.highscore}
            </span>
          </div>
          <div>
            {highscorePos ? (
              <>
                Rank №{" "}
                <span
                  className={`current-highscore ${
                    posChanged ? "changing" : ""
                  }`}
                >
                  {highscorePos > config.highscoreLimit
                    ? `>${config.highscoreLimit}`
                    : `${highscorePos}`}
                </span>
              </>
            ) : null}
          </div>
        </div>
        <div>
          {worm.dead === true && showMenu === false ? "[PRESS SPACEBAR]" : null}
        </div>
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
    </>
  );
};

export default IngameMenu;
