import Dexie from "dexie";
import canvasBg from "./../assets/images/ingame/canvasBg.png";

let fps = 60;

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
  indexDB: {
    name: "linnr",
    tabel: { settings: "settings" }
  }
};

//   const db = new Dexie(CONFIG.INDEXED_DB.NAME);
// db.version(1).stores({ [CONFIG.INDEXED_DB.USER_TABLE]: 'key' });

export { config };
