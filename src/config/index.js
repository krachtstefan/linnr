import canvasBg from "./../assets/images/ingame/canvasBg.png";
import deathscreen from "./../assets/images/ingame/deathscreen.png";

/**
 * velocity influences how fast the worm actually is on stage.
 * As the frames of the composed animation are constant and
 * given by the design, we need to adjust the speed to get
 * exactly the desired frames in one move
 *
 * Data by tring it out with a tilesize of 24
 * velocity of 1 = 10 frames
 * velocity of 0.5 = 20 frames
 * velocity of 2 = 5 frames
 * -> frames = 1/velocity*10
 * -> velocity = 100/frames/10
 *
 * with distance
 * -> velocity = 100/frames/10*distance/24
 */
let getVelocityFromFrames = (frames, tileSize) =>
  ((100 / frames / 10) * tileSize) / 24;

let fps = 60;
let tileSize = 24;
let animationSpeed = 0.4;

export default {
  assets: {
    spritesheet: "images/spritesheet.json",
    canvasBg,
    deathscreen
  },
  velocity: getVelocityFromFrames(12, tileSize),
  animationSpeed,
  fpms: fps / 1000,
  wormReactionFrames: 8, // number of frames, the player can still change the animation
  wormTurningFrames: 4, // number of frames, the worm needs to turn
  tileSize,
  background: 0x9ac503,
  autoplay: true
};
