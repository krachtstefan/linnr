import AnimatedSpritesheet from "./../pixi/AnimatedSprite.js";
import PropTypes from "prop-types";
import React from "react";
import { getWormAnimationName } from "./";

let Body = ({ x, y, direction, preloadedAnimations, dead }) => {
  let animationName = getWormAnimationName({ bodypart: "BY", direction });
  let animation =
    Object.keys(preloadedAnimations).includes(animationName) === true
      ? preloadedAnimations[animationName]
      : preloadedAnimations["WORM-Fallback"];

  // if (animation.currentFrame === animation.totalFrames - 1) {
  //   animation.stop();
  // }

  return animation && dead === false ? (
    <AnimatedSpritesheet x={x} y={y} animation={animation} />
  ) : null;
};

Body.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  direction: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  }),
  preloadedAnimations: PropTypes.object.isRequired,
  dead: PropTypes.bool.isRequired
};

export default Body;
