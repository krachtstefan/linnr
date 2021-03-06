import React, { useCallback, useEffect, useState } from "react";
import { soundDisable, soundEnable } from "../../redux/settings";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { config } from "../../config";
import menuSoundfile from "./../../assets/sound/menu.m4a";
import { placeItems } from "../../redux/stage";
import { resetWorm } from "../../redux/worm";
import useAudio from "../../hooks/use-audio";
import { useDebouncedCallback } from "use-debounce";
import { useHistory } from "react-router-dom";
import useKeyPress from "../../hooks/use-keypress";

const isTouchDevice = "ontouchstart" in window;

// TODO: add proptypes
const MainMenu = ({ filter = [] }) => {
  const [menuSound] = useAudio(menuSoundfile);
  let history = useHistory();
  const dispatch = useDispatch();
  const { soundOn } = useSelector(state => state.settings);

  const playMenuSound = useCallback(() => {
    if (soundOn === true) {
      menuSound.play();
    }
  }, [menuSound, soundOn]);

  const [toggleSound] = useDebouncedCallback(() => {
    dispatch(soundOn === true ? soundDisable() : soundEnable());
  }, 500);

  const [toggleFullscreen] = useDebouncedCallback(() => {
    let elem = document.querySelector("body");
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        console.warn(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  }, 1000);

  const [activeItem, setActiveItem] = useState(0);
  const {
    ArrowUp: arrowUp,
    ArrowDown: arrowDown,
    Enter: enter,
    Space: space,
    KeyP: keyP,
    KeyH: keyH,
    KeyA: keyA,
    KeyM: keyM,
    KeyR: keyR,
    KeyE: keyE,
    KeyF: keyF,
    Escape: escape,
    KeyU: keyU
  } = useKeyPress([
    "ArrowUp",
    "ArrowDown",
    "Enter",
    "Space",
    "KeyP",
    "KeyH",
    "KeyA",
    "KeyM",
    "KeyR",
    "KeyE",
    "KeyF",
    "KeyQ",
    "KeyU",
    "Escape"
  ]);

  const menuItems = [
    {
      label: "play",
      shortcut: keyP,
      Component: props => {
        return isTouchDevice ? (
          <button {...props}>
            <span className="no-keyboard">
              <span role="img" aria-label="sad">
                ☹️
              </span>{" "}
              no Keyboard{" "}
              <span role="img" aria-label="keyboard">
                ⌨️
              </span>
            </span>
          </button>
        ) : (
          <Link to={config.navigation.play} {...props}>
            <span className="shortcut">p</span>lay
          </Link>
        );
      },
      action: () => {
        return isTouchDevice ? null : history.push(config.navigation.play);
      }
    },
    {
      label: "retry",
      shortcut: keyR,
      Component: props => (
        <button onClick={() => dispatch(resetWorm())} {...props}>
          <span className="shortcut">r</span>etry
        </button>
      ),
      action: () => dispatch(resetWorm())
    },
    {
      label: "reset",
      shortcut: keyE,
      Component: props => (
        <button
          onClick={() => {
            dispatch(resetWorm());
            dispatch(placeItems("obstacle"));
            dispatch(placeItems("atmo"));
            dispatch(placeItems("food"));
          }}
          {...props}
        >
          r<span className="shortcut">e</span>set
        </button>
      ),
      action: () => {
        dispatch(resetWorm());
        dispatch(placeItems("obstacle"));
        dispatch(placeItems("atmo"));
        dispatch(placeItems("food"));
      }
    },
    {
      label: "highscoreSubmit",
      shortcut: keyU,
      Component: props => (
        <Link to={config.navigation.submitHighscore} {...props}>
          {/* TODO: add className to parent*/}
          <span className="submit">
            s<span className="shortcut">u</span>bmit highscore
          </span>
        </Link>
      ),
      action: () => history.push(config.navigation.submitHighscore)
    },
    {
      label: "highscoreView",
      shortcut: keyH,
      Component: props => (
        <Link to={config.navigation.highscore} {...props}>
          view <span className="shortcut">h</span>ighscore
        </Link>
      ),
      action: () => history.push(config.navigation.highscore)
    },
    {
      label: "about",
      shortcut: keyA,
      Component: props => (
        <Link to={config.navigation.about} {...props}>
          <span className="shortcut">a</span>bout
        </Link>
      ),
      action: () => history.push(config.navigation.about)
    },
    {
      label: "sound",
      shortcut: keyM,
      Component: props => (
        <button onClick={() => toggleSound()} {...props}>
          {soundOn === true ? "" : "un"}
          <span className="shortcut">m</span>ute sound
        </button>
      ),
      action: () => toggleSound()
    },
    {
      label: "fullscreen",
      shortcut: keyF,
      Component: props => (
        <button onClick={() => toggleFullscreen()} {...props}>
          toggle <span className="shortcut">f</span>ullscreen
        </button>
      ),
      action: () => toggleFullscreen()
    },
    {
      label: "back",
      shortcut: escape,
      Component: props => (
        <Link to={() => config.navigation.start} {...props}>
          back <span className="shorcutkey">esc</span>
        </Link>
      ),
      action: () => history.push(config.navigation.start)
    }
  ].filter(item => filter.includes(item.label));

  const shortCutKeys = menuItems.map(x => x.shortcut);

  useEffect(() => {
    if (arrowUp === true) {
      playMenuSound();
      setActiveItem(activeItem =>
        activeItem === 0 ? menuItems.length - 1 : activeItem - 1
      );
    }

    if (arrowDown === true) {
      playMenuSound();
      setActiveItem(activeItem =>
        activeItem < menuItems.length - 1 ? activeItem + 1 : 0
      );
    }
  }, [arrowUp, arrowDown, menuItems.length, playMenuSound]);

  useEffect(() => {
    if (enter === true || space === true) {
      menuItems[activeItem].action();
      playMenuSound();
    }
  }, [enter, space, activeItem, menuItems, playMenuSound]);

  useEffect(() => {
    const menuItem = menuItems.find(x => x.shortcut === true);
    if (menuItem) {
      menuItem.action();
    }
  }, [shortCutKeys, menuItems]);

  return (
    <div className="main-menu">
      <h1>Menu</h1>
      {menuItems.map((item, index) => {
        const { Component, label } = item;
        return (
          <Component
            className={index === activeItem ? "selected" : ""}
            key={label}
          />
        );
      })}
    </div>
  );
};

export default MainMenu;
