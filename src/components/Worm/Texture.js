import React, { useEffect, useReducer } from "react";

import AnimatedSpritesheet from "./../pixi/AnimatedSprite.js";
import { FILENAME_SEGMENTS } from "../../redux/worm";
import PropTypes from "prop-types";

const getWormAnimationSpecs = ({ bodypart, direction, animations }) => {
  const returnValidAnimationSpec = animationName => {
    let validAnimationName =
      Object.keys(animations).includes(animationName) === true
        ? animationName
        : "WORM-Fallback";
    return {
      name: validAnimationName,
      animation: animations[validAnimationName]
    };
  };

  let animationsArr = [];
  animationsArr.push(
    returnValidAnimationSpec(
      `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/2${
        FILENAME_SEGMENTS[direction.to]
      }`
    )
  );

  return animationsArr;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

let Texture = ({ x, y, direction, preloadedAnimations, dead, bodypart }) => {
  const [state, dispatch] = useReducer(reducer, {
    x,
    y,
    animationSpecs: getWormAnimationSpecs({
      bodypart,
      direction,
      animations: preloadedAnimations
    }),
    selectedAnimation: getWormAnimationSpecs({
      bodypart,
      direction,
      animations: preloadedAnimations
    })[0]
  });

  useEffect(() => {
    dispatch({
      type: "UPDATE",
      payload: {
        x,
        y,
        animationSpecs: getWormAnimationSpecs({
          bodypart,
          direction,
          animations: preloadedAnimations
        }),
        selectedAnimation: getWormAnimationSpecs({
          bodypart,
          direction,
          animations: preloadedAnimations
        })[0]
      }
    });
  }, [preloadedAnimations, x, y, bodypart, direction]);

  useEffect(() => {
    if (dead === true) {
      state.selectedAnimation.animation.stop();
    }
  }, [dead, state.selectedAnimation]);

  useEffect(() => {
    if (
      state.selectedAnimation &&
      state.selectedAnimation.animation.currentFrame ===
        state.selectedAnimation.animation.totalFrames - 1
    ) {
      state.selectedAnimation.animation.stop();
    }
  }, [state.selectedAnimation]);

  return state.selectedAnimation ? (
    <AnimatedSpritesheet
      x={state.x}
      y={state.y}
      animation={state.selectedAnimation.animation}
    />
  ) : null;
};

Texture.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  direction: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  }),
  preloadedAnimations: PropTypes.object.isRequired,
  bodypart: PropTypes.string.isRequired,
  dead: PropTypes.bool.isRequired
};

export default Texture;
