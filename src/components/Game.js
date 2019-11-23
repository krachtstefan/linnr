import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Controls from "./Controls";
import Debugger from "./Debugger";
import { Loader } from "pixi.js";
import Map from "./Map";
import Worm from "./Worm";
import config from "../config";
import { setSpritesheet } from "../redux/stage";

const Game = () => {
  const dispatch = useDispatch();
  const { spritesheet } = useSelector(state => state["stage"]["assets"]);
  useEffect(() => {
    let setup = () => {
      dispatch(
        setSpritesheet({
          spritesheet: Loader.shared.resources[config.assets.spritesheet]
        })
      );
    };
    Loader.shared.add(config.assets.spritesheet).load(setup);
  }, [dispatch]);
  return (
    <React.Fragment>
      {spritesheet ? (
        <React.Fragment>
          <Controls>
            <Map className="game">
              <Worm />
            </Map>
          </Controls>
          <div className="panel">
            <Debugger />
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};
export default Game;
