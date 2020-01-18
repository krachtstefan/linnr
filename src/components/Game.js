import * as PIXI from "pixi.js";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AnimatedSprite } from "pixi.js";
import Controls from "./Controls";
import { Loader } from "pixi.js";
import Map from "./Map";
import Worm from "./Worm";
import backgroundMusicFile from "./../assets/sound/Pfeffer.mp3";
import { config } from "../config";
import { setAsset } from "../redux/stage";
import useAudio from "./../hooks/use-audio";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.TARGET_FPMS = config.fpms;

const createAnimation = (spritesheet, animation) => {
  let animationArr = spritesheet.spritesheet.animations[animation.name];
  let newAnimation = new AnimatedSprite(animationArr);
  newAnimation.y = animation.offset.y;
  newAnimation.x = animation.offset.x;
  newAnimation.width = animation.space.width * config.tileSize;
  newAnimation.height = animation.space.height * config.tileSize;
  newAnimation.animationSpeed = config.animationSpeed;
  newAnimation.play();
  return newAnimation;
};

const Game = () => {
  const dispatch = useDispatch();
  const [backgroundMusic] = useAudio(backgroundMusicFile, true);
  const [preloadedWormAnimations, setPreloadedWormAnimations] = useState(null);
  const {
    spritesheet,
    canvasBg,
    wormAnimations,
    boneCounter,
    soundOn
  } = useSelector(state => {
    let { worm, stage, settings } = state;
    return {
      spritesheet: stage.assets.spritesheet,
      canvasBg: stage.assets.canvasBg,
      wormAnimations: worm.animations,
      boneCounter: worm.position.length,
      soundOn: settings.soundOn
    };
  });

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
       * give every bone, every possible animation
       */
      // TODO, make this more flexible
      let animations = [...Array(boneCounter + 90)].map(() =>
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
  }, [spritesheet, wormAnimations, setPreloadedWormAnimations, boneCounter]);

  return spritesheet && canvasBg && preloadedWormAnimations ? (
    <Controls>
      <Map>
        <Worm preloadedAnimations={preloadedWormAnimations} />
      </Map>
    </Controls>
  ) : (
    <span>LOADING...</span>
  );
};
export default Game;
