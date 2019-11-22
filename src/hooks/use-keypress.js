import { useEffect, useState } from "react";

const useKeyPress = targetKeys => {
  const [keyPressed, setKeyPressed] = useState(
    targetKeys.reduce((acc, curr) => ({ ...acc, [curr]: false }), {})
  );

  // Add event listeners
  useEffect(() => {
    const downHandler = e => {
      if (Object.keys(keyPressed).includes(e.key)) {
        setKeyPressed(old => ({ ...old, [e.key]: true }));
        e.preventDefault();
      }
    };

    const upHandler = e => {
      if (Object.keys(keyPressed).includes(e.key)) {
        setKeyPressed(old => ({ ...old, [e.key]: false }));
        e.preventDefault();
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