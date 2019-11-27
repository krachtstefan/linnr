import * as PIXI from "pixi.js";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Controls from "./Controls";
import Debugger from "./Debugger";
import Dpad from "./Dpad";
import { Loader } from "pixi.js";
import Map from "./Map";
import Worm from "./Worm";
import config from "../config";
import { setAsset } from "../redux/stage";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const Game = () => {
  const dispatch = useDispatch();
  const { spritesheet, canvasBg, deathscreen } = useSelector(
    state => state["stage"]["assets"]
  );
  useEffect(() => {
    let setup = () => {
      dispatch(
        setAsset({
          spritesheet: Loader.shared.resources[config.assets.spritesheet],
          canvasBg: Loader.shared.resources[config.assets.canvasBg],
          deathscreen: Loader.shared.resources[config.assets.deathscreen]
        })
      );
    };
    Loader.shared
      .add(config.assets.spritesheet)
      .add(config.assets.canvasBg)
      .add(config.assets.deathscreen)
      .load(setup);
  }, [dispatch]);

  return (
    <React.Fragment>
      {spritesheet && canvasBg && deathscreen ? (
        <React.Fragment>
          <div className="logo"></div>
          <div className="game">
            <Controls>
              <Map>
                <Worm />
              </Map>
            </Controls>
            <Dpad />
          </div>
          <Debugger />
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};
export default Game;
