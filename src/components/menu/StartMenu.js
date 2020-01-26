import React, { useEffect, useState } from "react";
import { soundDisable, soundEnable } from "../../redux/settings";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { config } from "./../../config";
import { useDebouncedCallback } from "use-debounce";
import { useHistory } from "react-router-dom";
import useKeyPress from "../../hooks/use-keypress";

const StartMenu = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const { soundOn } = useSelector(state => state.settings);

  const [toggleSound] = useDebouncedCallback(test => {
    dispatch(soundOn === true ? soundDisable() : soundEnable());
  }, 500);

  const [activeItem, setActiveItem] = useState(0);
  const {
    ArrowUp: arrowUp,
    ArrowDown: arrowDown,
    Enter: enter,
    Space: space,
    KeyP: keyP,
    KeyH: keyH,
    KeyC: keyC,
    KeyS: keyS
  } = useKeyPress([
    "ArrowUp",
    "ArrowDown",
    "Enter",
    "Space",
    "KeyP",
    "KeyH",
    "KeyC",
    "KeyS"
  ]);

  const menuItems = [
    {
      label: "play",
      shortcut: keyP,
      Component: props => (
        <Link to={config.navigation.play} {...props}>
          <span className="shortcut">p</span>lay
        </Link>
      ),
      action: () => history.push(config.navigation.play)
    },
    {
      label: "highscore",
      shortcut: keyH,
      Component: props => (
        <Link to={config.navigation.highscore} {...props}>
          <span className="shortcut">h</span>ighscore
        </Link>
      ),
      action: () => history.push(config.navigation.highscore)
    },
    {
      label: "credits",
      shortcut: keyC,
      Component: props => (
        <Link to={config.navigation.credits} {...props}>
          <span className="shortcut">c</span>redits
        </Link>
      ),
      action: () => history.push(config.navigation.credits)
    },
    {
      label: "sound",
      shortcut: keyS,
      Component: props => (
        <button onClick={() => toggleSound()} {...props}>
          <span className="shortcut">s</span>ound is{" "}
          <span className="state">{soundOn === true ? "ON" : "OFF"}</span>
        </button>
      ),
      action: () => toggleSound()
    }
  ];

  const shortCutKeys = menuItems.map(x => x.shortcut);

  useEffect(() => {
    if (arrowUp === true) {
      setActiveItem(activeItem =>
        activeItem === 0 ? menuItems.length - 1 : activeItem - 1
      );
    }

    if (arrowDown === true) {
      setActiveItem(activeItem =>
        activeItem < menuItems.length - 1 ? activeItem + 1 : 0
      );
    }
  }, [arrowUp, arrowDown, menuItems.length]);

  useEffect(() => {
    if (enter === true || space === true) {
      menuItems[activeItem].action();
    }
  }, [enter, space, activeItem, menuItems]);

  useEffect(() => {
    const menuItem = menuItems.find(x => x.shortcut === true);
    if (menuItem) {
      menuItem.action();
    }
  }, [shortCutKeys, menuItems]);

  return (
    <div className="start-menu">
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

export default StartMenu;
