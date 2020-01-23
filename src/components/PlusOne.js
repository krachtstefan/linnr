import AnimatedSprite, { createAnimation } from "./pixi/AnimatedSprite";
import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import { config } from "../config";

const Food = ({ x, y, spritesheet }) => {
  let [pixiAnimation] = useState(() => {
    let pixiAnimation = createAnimation(
      spritesheet,
      config.leveldesign.objects.availableAnimations[
        "OBJECTS.HITBOX-ONO/PlusEins"
      ]
    );

    pixiAnimation.animationSpeed = 0.8;
    pixiAnimation.loop = false;
    return pixiAnimation;
  });

  useEffect(() => {
    console.log(x, y);
    pixiAnimation.gotoAndPlay(0);
  }, [x, y, pixiAnimation]);

  return <AnimatedSprite x={x} y={y} animation={pixiAnimation} />;
};

Food.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  spritesheet: PropTypes.object.isRequired
};

export default Food;
