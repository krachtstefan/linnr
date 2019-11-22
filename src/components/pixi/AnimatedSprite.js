import * as PIXI from "pixi.js";

import { PixiComponent } from "@inlet/react-pixi";

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
