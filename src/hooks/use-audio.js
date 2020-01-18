import { useEffect, useState } from "react";

const useAudio = (url, loop = false) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    setPlaying(!playing);
  };

  useEffect(() => {
    playing ? audio.play() : audio.pause();
    return () => {
      audio.pause();
    };
  }, [playing, audio]);

  useEffect(() => {
    audio.addEventListener("ended", () => {
      setPlaying(false);
    });
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, [audio]);

  return [toggle];
};

export default useAudio;
