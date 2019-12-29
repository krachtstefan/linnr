import React, { useEffect, useState } from "react";

import AnimatedSpritesheet from "./../pixi/AnimatedSprite.js";
import PropTypes from "prop-types";
import { getWormAnimationName } from "./";

let Body = ({ x, y, direction, preloadedAnimations, dead }) => {
  let [animationName, setAnimationName] = useState(
    getWormAnimationName({ bodypart: "BY", direction })
  );

  let [animation, setAnimation] = useState(
    Object.keys(preloadedAnimations).includes(animationName) === true
      ? preloadedAnimations[animationName]
      : preloadedAnimations["WORM-Fallback"]
  );

  useEffect(() => {
    setAnimationName(getWormAnimationName({ bodypart: "BY", direction }));
  }, [direction]);

  useEffect(() => {
    setAnimation(
      Object.keys(preloadedAnimations).includes(animationName) === true
        ? preloadedAnimations[animationName]
        : preloadedAnimations["WORM-Fallback"]
    );
  }, [preloadedAnimations, animationName]);

  useEffect(() => {
    if (dead === true) {
      animation.stop();
    }
  }, [animation, dead]);

  useEffect(() => {
    if (animation.currentFrame === animation.totalFrames - 1) {
      // animation.stop();
    }
  }, [animation, animation.currentFrame, animation.totalFrames]);

  return animation ? (
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
