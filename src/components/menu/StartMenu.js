import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { config } from "./../../config";
import { useHistory } from "react-router-dom";
import useKeyPress from "../../hooks/use-keypress";

const StartMenu = () => {
  let history = useHistory();
  const [activeItem, setActiveItem] = useState(0);
  const {
    ArrowUp: arrowUp,
    ArrowDown: arrowDown,
    Enter: enter,
    Space: space,
    KeyP: keyP,
    KeyH: keyH,
    KeyC: keyC
  } = useKeyPress([
    "ArrowUp",
    "ArrowDown",
    "Enter",
    "Space",
    "KeyP",
    "KeyH",
    "KeyC"
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
