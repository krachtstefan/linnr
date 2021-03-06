import * as PIXI from "pixi.js";

import React, { useEffect, useRef, useState } from "react";
import { placeItems, setAsset } from "../../redux/stage";
import { useDispatch, useSelector } from "react-redux";

import Controls from "./../Controls";
import IngameMenu from "./../menu/IngameMenu";
import { Loader } from "pixi.js";
import Map from "./../Map";
import Worm from "./../Worm";
import backgroundMusicFile from "./../../assets/sound/Pfeffer.mp3";
import { config } from "../../config";
import { createAnimation } from "./../pixi/AnimatedSprite";
import eatSoundFile from "./../../assets/sound/sfx_coin_double1.mp3";
import { resetWorm } from "./../../redux/worm";
import useAudio from "./../../hooks/use-audio";

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
    highscore,
    dead
  } = useSelector(state => {
    let { worm, stage, settings } = state;
    return {
      spritesheet: stage.assets.spritesheet,
      canvasBg: stage.assets.canvasBg,
      wormAnimations: config.leveldesign.worm.animations,
      highscore: worm.highscore,
      soundOn: settings.soundOn,
      stageTileCount: stage.board.length * stage.board[0].length,
      settings: settings,
      dead: worm.dead
    };
  });

  useEffect(() => {
    dispatch(resetWorm());
    dispatch(placeItems("obstacle"));
    dispatch(placeItems("atmo"));
    dispatch(placeItems("food"));
  }, [dispatch]);

  useEffect(() => {
    if (restartButton.current) {
      restartButton.current.focus();
    }
  }, [dead]);

  useEffect(() => {
    dispatch(placeItems("food", true));
  }, [dispatch, highscore]);

  useEffect(() => {
    if (soundOn === true && highscore > 0) {
      eatSound.play();
    }
  }, [soundOn, eatSound, spritesheet, highscore]);

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
      <IngameMenu />
    </Controls>
  ) : (
    <span>LOADING...</span>
  );
};
export default Game;
