import React, { useEffect, useReducer, useState } from "react";

import AnimatedSpritesheet from "./../pixi/AnimatedSprite.js";
import PropTypes from "prop-types";
import { getWormAnimationName } from "./";

let Head = ({ x, y, direction, preloadedAnimations, dead }) => {
  let animationName = getWormAnimationName({ bodypart: "HD", direction });
  let [animation, setAnimation] = useState(
    Object.keys(preloadedAnimations).includes(animationName) === true
      ? preloadedAnimations[animationName]
      : preloadedAnimations["WORM-Fallback"]
  );

  useEffect(() => {
    setAnimation(
      Object.keys(preloadedAnimations).includes(animationName) === true
        ? preloadedAnimations[animationName]
        : preloadedAnimations["WORM-Fallback"]
    );
  }, [preloadedAnimations, animationName]);

  if (
    animation &&
    animation.textures[0]["textureCacheIds"][0].startsWith("WORM-Fallback") ===
      false &&
    animation.textures[0]["textureCacheIds"][0].startsWith(animationName) ===
      false
  ) {
    console.warn("animation out of synch");
  }

  // if (animation.currentFrame === animation.totalFrames - 1) {
  //   animation.stop();
  // }

  return animation && dead === false ? (
    <AnimatedSpritesheet x={x} y={y} animation={animation} />
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
  dead: PropTypes.bool.isRequired
};

export default Head;
