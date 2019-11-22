import { combineReducers } from "redux";
import { stageReducer as stage } from "./stage";
import { wormReducer as worm } from "./worm";
export default combineReducers({ stage, worm });
