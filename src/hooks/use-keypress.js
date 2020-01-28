import { useEffect, useState } from "react";

// trigger preventDefault when arrow keys are used (prevents scrolling)
const preventDefaultList = [
  "ArrowUp",
  "ArrowDown",
  "ArrowRight",
  "ArrowLeft",
  "Space"
];

const useKeyPress = targetKeys => {
  const [keyPressed, setKeyPressed] = useState(
    targetKeys.reduce((acc, curr) => ({ ...acc, [curr]: false }), {})
  );

  // Add event listeners
  useEffect(() => {
    const downHandler = e => {
      if (Object.keys(keyPressed).includes(e.code)) {
        if (preventDefaultList.includes(e.code)) {
          e.preventDefault();
        }
        setKeyPressed(old => ({ ...old, [e.code]: true }));
      }
    };

    const upHandler = e => {
      if (Object.keys(keyPressed).includes(e.code)) {
        if (preventDefaultList.includes(e.code)) {
          e.preventDefault();
        }
        setKeyPressed(old => ({ ...old, [e.code]: false }));
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [keyPressed]);

  return keyPressed;
};

export default useKeyPress;
