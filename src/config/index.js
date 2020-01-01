import canvasBg from "./../assets/images/ingame/canvasBg.png";
import deathscreen from "./../assets/images/ingame/deathscreen.png";

/**
 * velocity influences fast the worm actualy is on stage
 * as the frames of composed animation are constant and
 * given by the design, we need to adjust the speed to get
 * exactly the desired frames in one move
 *
 * with a tilesize of 24:
 * velocity of 1 = 10 frames
 * velocity of 0.5 = 20 frames
 * velocity of 2 = 5 frames
 * -> frames = 1/velocity*10
 * -> velocity = 100/frames/10
 */
let getVelocityFromFrames = frames => 100 / frames / 10;

let fps = 20;
let tileSize = 24;

export default {
  assets: {
    spritesheet: "images/spritesheet.json",
    canvasBg,
    deathscreen
  },
  velocity: getVelocityFromFrames(12, tileSize),
  fpms: fps / 1000,
  tileSize: 24,
  background: 0x9ac503,
  autoplay: true
};
