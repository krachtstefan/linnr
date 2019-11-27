import React, { useEffect } from "react";

import { setNextDirection } from "../redux/controls";
import { useDispatch } from "react-redux";
import useGamepad from "../hooks/use-gamepad";
import useKeyPress from "../hooks/use-keypress";

const Controls = ({ ...props }) => {
  const dispatch = useDispatch();

  const {
    ArrowUp: arrowUp,
    ArrowDown: arrowDown,
    ArrowLeft: arrowLeft,
    ArrowRight: arrowRight
  } = useKeyPress(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

  const gamepadKeys = useGamepad();
  const dPadUp = gamepadKeys.includes(12);
  const dPadDown = gamepadKeys.includes(13);
  const dPadLeft = gamepadKeys.includes(14);
  const dPadRight = gamepadKeys.includes(15);

  useEffect(() => {
    dispatch(
      setNextDirection({
        N: arrowUp || dPadUp,
        S: arrowDown || dPadDown,
        W: arrowLeft || dPadLeft,
        E: arrowRight || dPadRight
      })
    );
  }, [
    arrowUp,
    arrowDown,
    arrowLeft,
    arrowRight,
    dispatch,
    dPadUp,
    dPadDown,
    dPadLeft,
    dPadRight
  ]);

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default Controls;
