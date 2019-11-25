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

const Game = () => {
  const dispatch = useDispatch();
  const { spritesheet, canvasBg } = useSelector(
    state => state["stage"]["assets"]
  );
  useEffect(() => {
    let setup = () => {
      dispatch(
        setAsset({
          spritesheet: Loader.shared.resources[config.assets.spritesheet],
          canvasBg: Loader.shared.resources[config.assets.canvasBg]
        })
      );
    };
    Loader.shared
      .add(config.assets.spritesheet)
      .add(config.assets.canvasBg)
      .load(setup);
  }, [dispatch]);

  return (
    <React.Fragment>
      {spritesheet && canvasBg ? (
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
