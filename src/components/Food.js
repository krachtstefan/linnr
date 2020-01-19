import AnimatedSprite, { createAnimation } from "./pixi/AnimatedSprite";
import React, { useState } from "react";

import PropTypes from "prop-types";

const Food = ({ x, y, spritesheet, animation }) => {
  let [pixiAnimation] = useState(() => {
    let pixiAnimation = createAnimation(spritesheet, animation);
    pixiAnimation.loop = false;
    return pixiAnimation;
  });

  return <AnimatedSprite x={x} y={y} animation={pixiAnimation} />;
};

Food.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  animation: PropTypes.object.isRequired
};

export default Food;
