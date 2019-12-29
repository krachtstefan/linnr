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
    x: null,
    y: null,
    animation: null
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
  }, [preloadedAnimations, x, y, direction]);

  // if (
  //   animation &&
  //   animation.textures[0]["textureCacheIds"][0].startsWith("WORM-Fallback") ===
  //     false &&
  //   animation.textures[0]["textureCacheIds"][0].startsWith(animationName) ===
  //     false
  // ) {
  //   console.warn("animation out of synch");
  // }

  // if (animation.currentFrame === animation.totalFrames - 1) {
  //   animation.stop();
  // }

  return state.animation && dead === false ? (
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
