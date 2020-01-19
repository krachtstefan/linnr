import * as PIXI from "pixi.js";

import React, { useEffect, useRef, useState } from "react";
import { placeFood, placeObstacles, setAsset } from "../redux/stage";
import { soundDisable, soundEnable } from "../redux/settings";
import { useDispatch, useSelector } from "react-redux";

import Controls from "./Controls";
import { Loader } from "pixi.js";
import Map from "./Map";
import Worm from "./Worm";
import backgroundMusicFile from "./../assets/sound/Pfeffer.mp3";
import { config } from "../config";
import { createAnimation } from "./pixi/AnimatedSprite";
import eatSoundFile from "./../assets/sound/sfx_coin_double1.mp3";
import { resetWorm } from "../redux/worm";
import { stopGame } from "../redux/game";
import useAudio from "./../hooks/use-audio";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.TARGET_FPMS = config.fpms;

const Game = () => {
  const dispatch = useDispatch();
  const restartButton = useRef();
  const [backgroundMusic] = useAudio(backgroundMusicFile, true);
  const [eatSound] = useAudio(eatSoundFile);
  const [preloadedWormAnimations, setPreloadedWormAnimations] = useState(null);
  const {
    spritesheet,
    canvasBg,
    wormAnimations,
    soundOn,
    stageTileCount,
    foodCount,
    settings,
    dead
  } = useSelector(state => {
    let { worm, stage, settings } = state;
    return {
      spritesheet: stage.assets.spritesheet,
      canvasBg: stage.assets.canvasBg,
      wormAnimations: worm.animations,
      foodCount: worm.food,
      soundOn: settings.soundOn,
      stageTileCount: stage.board.length * stage.board[0].length,
      settings: settings,
      dead: worm.dead
    };
  });

  useEffect(() => {
    if (restartButton.current) {
      restartButton.current.focus();
    }
  }, [dead]);

  useEffect(() => {
    dispatch(placeFood());
  }, [dispatch, foodCount]);

  useEffect(() => {
    dispatch(placeObstacles());
  }, [dispatch]);

  useEffect(() => {
    if (soundOn === true && foodCount > 0) {
      eatSound.play();
    }
  }, [soundOn, eatSound, spritesheet, foodCount]);

  useEffect(() => {
    if (soundOn === true) {
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }
    return () => {
      backgroundMusic.pause();
    };
  }, [backgroundMusic, soundOn]);

  useEffect(() => {
    if (spritesheet === null) {
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
    }
  }, [spritesheet, dispatch]);

  useEffect(() => {
    if (spritesheet) {
      /**
       * animations instances can not be used multiple times on stage,
       * give every bone, every possible animation. At an extra index
       * to give the worm more buffer to grow
       */
      let animations = [...Array(stageTileCount)].map(() =>
        Object.keys(wormAnimations).reduce(
          (prev, curr) => ({
            ...prev,
            [curr]: createAnimation(spritesheet, wormAnimations[curr])
          }),
          {}
        )
      );
      setPreloadedWormAnimations(animations);
    }
  }, [spritesheet, wormAnimations, setPreloadedWormAnimations, stageTileCount]);

  return spritesheet && canvasBg && preloadedWormAnimations ? (
    <Controls>
      <Map>
        <Worm preloadedAnimations={preloadedWormAnimations} />
      </Map>
      <div className="gamebar">
        <div className="highscore">
          <span role="img" aria-label="highscore">
            🍄
          </span>{" "}
          {foodCount}
        </div>

        {dead === true ? (
          <>
            <button
              ref={restartButton}
              onClick={() => {
                dispatch(resetWorm());
              }}
            >
              RETRY
            </button>
            <button
              onClick={() => {
                dispatch(stopGame());
                dispatch(resetWorm());
              }}
            >
              QUIT
            </button>
          </>
        ) : (
          <>
            <div />
            <div />
          </>
        )}
        <button
          className={`sound ${settings.soundOn ? "" : "disabled"}`.trim()}
          onClick={() =>
            settings.soundOn === true
              ? dispatch(soundDisable())
              : dispatch(soundEnable())
          }
        >
          <span role="img" aria-label="toggle sound">
            💤
          </span>
        </button>
      </div>
    </Controls>
  ) : (
    <span>LOADING...</span>
  );
};
export default Game;
