import { useEffect, useState } from "react";

const useAudio = (url, loop = false) => {
  const [audio] = useState(new Audio(url));

  useEffect(() => {
    audio.addEventListener("ended", () => {
      if (loop === true) {
        audio.play();
      }
    });
    return () => {
      audio.removeEventListener("ended", () => audio.pause());
    };
  }, [audio, loop]);

  return [audio];
};

export default useAudio;
