import * as PIXI from "pixi.js";

import { AnimatedSprite } from "pixi.js";
import { PixiComponent } from "@inlet/react-pixi";
import { config } from "../../config";

export const createAnimation = (spritesheet, animation) => {
  let animationArr = spritesheet.spritesheet.animations[animation.name];
  let newAnimation = new AnimatedSprite(animationArr);
  newAnimation.y = animation.offset.y;
  newAnimation.x = animation.offset.x;
  newAnimation.width = animation.space.width * config.tileSize;
  newAnimation.height = animation.space.height * config.tileSize;
  newAnimation.animationSpeed = config.animationSpeed;
  newAnimation.play();
  return newAnimation;
};

export default PixiComponent("AnimatedSpritesheet", {
  create: () => {
    return new PIXI.Container();
  },

  applyProps: (instance, oldProps, newProps) => {
    const { animation, ...containerProps } = newProps;
    instance = Object.assign(instance, containerProps);
    instance.removeChildren();
    instance.addChild(animation);
  }
});
