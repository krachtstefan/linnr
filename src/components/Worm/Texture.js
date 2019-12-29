import React, { useEffect, useReducer } from "react";

import AnimatedSpritesheet from "./../pixi/AnimatedSprite.js";
import { FILENAME_SEGMENTS } from "../../redux/worm";
import PropTypes from "prop-types";

const getWormAnimationSpecs = ({ bodypart, direction, animations }) => {
  let animationName = `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/2${
    FILENAME_SEGMENTS[direction.to]
  }`;
  animationName =
    Object.keys(animations).includes(animationName) === true
      ? animationName
      : "WORM-Fallback";

  return animations[animationName];
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
    })
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
        })
      }
    });
  }, [preloadedAnimations, x, y, bodypart, direction]);

  useEffect(() => {
    if (dead === true) {
      state.animationSpecs.stop();
    }
  }, [dead, state.animationSpecs]);

  useEffect(() => {
    if (
      state.animationSpecs &&
      state.animationSpecs.currentFrame === state.animationSpecs.totalFrames - 1
    ) {
      state.animationSpecs.stop();
    }
  }, [state.animationSpecs, state.animationSpecs.currentFrame]);

  return state.animationSpecs ? (
    <AnimatedSpritesheet
      x={state.x}
      y={state.y}
      animation={state.animationSpecs}
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
