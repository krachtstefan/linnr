import canvasBg from "./../assets/images/ingame/canvasBg.png";
import deathscreen from "./../assets/images/ingame/deathscreen.png";

let fps = 60;

export default {
  assets: {
    spritesheet: "images/spritesheet.json",
    canvasBg,
    deathscreen
  },
  velocity: 1,
  fps: 60,
  fpms: fps / 1000,
  tileSize: 24,
  background: 0x9ac503,
  autoplay: true
};
