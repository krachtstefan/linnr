import { combineReducers } from "redux";
import { highscoreReducer as highscore } from "./highscore";
import { settingsReducer as settings } from "./settings";
import { stageReducer as stage } from "./stage";
import { wormReducer as worm } from "./worm";
export default combineReducers({ stage, worm, highscore, settings });
