import { useCallback, useEffect, useRef, useState } from "react";

let getGamepad = () => {
  var gamepads = navigator.getGamepads
    ? navigator.getGamepads()
    : navigator.webkitGetGamepads
    ? navigator.webkitGetGamepads()
    : [];
  return gamepads[0] ? gamepads[0] : undefined;
};

const useGamepad = () => {
  const requestAFRef = useRef();
  const gamepadRef = useRef();

  const [keysPressed, setKeysPressed] = useState([]);

  const updateStatus = useCallback(() => {
    if (gamepadRef.current !== undefined) {
      let keysPressed = gamepadRef.current.buttons
        .map((btn, index) => {
          return [btn, index];
        })
        .filter(btnArr => btnArr[0].pressed === true)
        .map(btnArr => btnArr[1]);

      setKeysPressed(keysPressed);
      gamepadRef.current = getGamepad();
    }
  }, []);

  useEffect(() => {
    requestAFRef.current = requestAnimationFrame(updateStatus);
  }, [keysPressed, updateStatus]);

  useEffect(() => {
    const connecthandler = e => {
      gamepadRef.current = e.gamepad;
      requestAFRef.current = requestAnimationFrame(updateStatus);
    };

    window.addEventListener("gamepadconnected", connecthandler);
    return () => {
      window.removeEventListener("gamepadconnected", connecthandler);
    };
  }, [updateStatus]);

  return keysPressed;
};

export default useGamepad;
