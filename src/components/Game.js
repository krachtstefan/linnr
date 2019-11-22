import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Controls from "./Controls";
import { Loader } from "pixi.js";
import Map from "./Map";
import config from "../config";
import { setSpritesheet } from "../redux/stage";

const Game = () => {
  const dispatch = useDispatch();
  const { spritesheet } = useSelector(state => state["stage"]);
  useEffect(() => {
    let setup = () => {
      dispatch(
        setSpritesheet(Loader.shared.resources[config.assets.spritesheet])
      );
    };
    Loader.shared.add(config.assets.spritesheet).load(setup);
  }, [dispatch]);
  return (
    <React.Fragment>
      {spritesheet ? (
        <React.Fragment>
          <Controls>
            <Map className="game" />
          </Controls>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};
export default Game;
