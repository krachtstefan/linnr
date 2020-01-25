import "firebase/firestore";

import Dexie from "dexie";
import canvasBg from "./../assets/images/ingame/Border.png";
import firebase from "firebase/app";
import firebaseCredentials from "./firebase";
import leveldesign from "./leveldesign";

const firebaseConfig = firebase.initializeApp(firebaseCredentials);
const isDev = process.env.NODE_ENV === "development";
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
  spriteSizeScaling: 2,
  background: 0xaf9980,
  soundOn: true,
  leveldesign,
  ga: {
    trackingId: "UA-748711-16",
    debug: isDev === true ? true : false,
    gaOptions: {
      cookieDomain: "none"
    }
  },
  indexDB: {
    name: "linnr",
    table: { settings: "settings" }
  },
  highscoreVersion: 0.1,
  firebase: {
    collections: {
      highscore: `highscore${isDev === true ? "_dev" : ""}`
    }
  }
};

const db = new Dexie(config.indexDB.name);
db.version(1).stores({ [config.indexDB.table.settings]: "key" });

export { config, db, firebaseConfig as firebase };
