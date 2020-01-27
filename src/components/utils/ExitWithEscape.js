import { config } from "./../../config";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import useKeyPress from "./../../hooks/use-keypress";

const ExitWithEscape = () => {
  let history = useHistory();
  const { Escape: escape } = useKeyPress(["Escape"]);

  useEffect(() => {
    if (escape === true) {
      history.push(config.navigation.start);
    }
  }, [escape, history]);
  return null;
};

export default ExitWithEscape;
