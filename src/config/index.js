import canvasBg from "./../assets/images/ingame/canvasBg.png";
import deathscreen from "./../assets/images/ingame/deathscreen.png";

let fps = 60;

export default {
  assets: {
    spritesheet: "images/spritesheet.json",
    canvasBg,
    deathscreen
  },
  animationSpeed: 0.4,
  fpms: fps / 1000,
  wormSequences: [
    8, // sequence 0 : player has 8 frames to decide the next animation
    4 // sequence 1 : worm needs 4 frames to turn
  ],
  tileSize: 24,
  background: 0x9ac503,
  autoplay: true
};
