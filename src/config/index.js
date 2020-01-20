import Dexie from "dexie";
import canvasBg from "./../assets/images/ingame/Border.png";

let fps = 60;

// TODO: remove this
export const randomNumberMinMax = (min, max, round = true) => {
  let minMax = Math.random() * (max - min) + min;
  return round === true ? Math.round(minMax) : minMax;
};

const config = {
  assets: {
    spritesheet: "images/spritesheet.json",
    canvasBg
  },
  animationSpeed: 0.6,
  fpms: fps / 1000,
  wormSequences: [
    8, // sequence 0 : player has 8 frames to decide the next animation
    4 // sequence 1 : worm needs 4 frames to turn
  ],
  tileSize: 48,
  background: 0xaf9980,
  autoplay: true,
  soundOn: true,
  foodDropCount: () => randomNumberMinMax(3, 10),
  obstacleDropCount: () => randomNumberMinMax(10, 20),
  defaultAnimationProps: {
    offset: {
      x: 0,
      y: 0
    },
    space: {
      width: 1,
      height: 1
    }
  },
  indexDB: {
    name: "linnr",
    table: { settings: "settings" }
  }
};

const db = new Dexie(config.indexDB.name);
db.version(1).stores({ [config.indexDB.table.settings]: "key" });

export { config, db };
