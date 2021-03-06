import AnimatedSprite, { createAnimation } from "./pixi/AnimatedSprite";
import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import { config } from "../config";

const PlusOne = ({ x, y, spritesheet }) => {
  let [pixiAnimation] = useState(() => {
    let pixiAnimation = createAnimation(
      spritesheet,
      config.leveldesign.objects.availableAnimations[
        "SPRITES.1x1-META/1x1/PlusEins"
      ]
    );

    pixiAnimation.animationSpeed = 0.8;
    pixiAnimation.loop = false;
    return pixiAnimation;
  });

  useEffect(() => pixiAnimation.gotoAndPlay(0), [x, y, pixiAnimation]);

  return <AnimatedSprite x={x} y={y} animation={pixiAnimation} />;
};

PlusOne.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  spritesheet: PropTypes.object.isRequired
};

export default PlusOne;
