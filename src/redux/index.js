import { combineReducers } from "redux";
import { gameReducer as game } from "./game";
import { highscoreReducer as highscore } from "./highscore";
import { settingsReducer as settings } from "./settings";
import { stageReducer as stage } from "./stage";
import { wormReducer as worm } from "./worm";
export default combineReducers({ stage, worm, game, highscore, settings });
