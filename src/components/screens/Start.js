import React, { useEffect, useState } from "react";

import MainMenu from "./../menu/MainMenu";
import titleCard from "./../../assets/images/title_card.png";
import useKeyPress from "../../hooks/use-keypress";

const isTouchDevice = "ontouchstart" in window;

const fullscreen = document.fullscreenEnabled ? ["fullscreen"] : [];
const menuItems = ["play", "highscoreView", "about", "sound", ...fullscreen];

const Start = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { Space: space, Escape: escape } = useKeyPress(["Space", "Escape"]);

  useEffect(() => {
    if (space === true) {
      setShowMenu(true);
    }
  }, [space]);

  useEffect(() => {
    if (space === true) {
      setShowMenu(true);
    }
  }, [space]);

  useEffect(() => {
    if (escape === true) {
      setShowMenu(false);
    }
  }, [escape]);

  return (
    <div className="start-screen">
      <div className="title-card">
        {showMenu === true ? <MainMenu filter={menuItems} /> : null}
        <img alt="Linnr - it's not snake" src={titleCard} />
      </div>
      {showMenu === true ? (
        <span></span>
      ) : (
        <button className="start-button" onClick={() => setShowMenu(true)}>
          {isTouchDevice ? "→ START ←" : "[PRESS SPACEBAR]"}
        </button>
      )}
    </div>
  );
};

export default Start;
