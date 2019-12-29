import React, { useEffect, useReducer } from "react";

import AnimatedSpritesheet from "./../pixi/AnimatedSprite.js";
import { FILENAME_SEGMENTS } from "../../redux/worm";
import PropTypes from "prop-types";

const getWormAnimationName = ({
  bodypart,
  direction,
  available = [],
  fallback = ""
}) => {
  let animationName = `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/2${
    FILENAME_SEGMENTS[direction.to]
  }`;
  return available.includes(animationName) === true ? animationName : fallback;
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

let Head = ({ x, y, direction, preloadedAnimations, dead, bodypart }) => {
  const [state, dispatch] = useReducer(reducer, {
    x,
    y,
    animation:
      preloadedAnimations[
        getWormAnimationName({
          bodypart: bodypart,
          direction,
          available: Object.keys(preloadedAnimations),
          fallback: "WORM-Fallback"
        })
      ]
  });

  useEffect(() => {
    dispatch({
      type: "UPDATE",
      payload: {
        x,
        y,
        animation:
          preloadedAnimations[
            getWormAnimationName({
              bodypart: bodypart,
              direction,
              available: Object.keys(preloadedAnimations),
              fallback: "WORM-Fallback"
            })
          ]
      }
    });
  }, [preloadedAnimations, x, y, bodypart, direction]);

  useEffect(() => {
    if (dead === true) {
      state.animation.stop();
    }
  }, [dead, state.animation]);

  useEffect(() => {
    if (
      state.animation &&
      state.animation.currentFrame === state.animation.totalFrames - 1
    ) {
      state.animation.stop();
    }
  }, [state.animation.currentFrame]);

  return state.animation ? (
    <AnimatedSpritesheet x={state.x} y={state.y} animation={state.animation} />
  ) : null;
};

Head.propTypes = {
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

export default Head;
