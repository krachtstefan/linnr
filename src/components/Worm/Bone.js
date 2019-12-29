import React, { useState } from "react";

import PropTypes from "prop-types";
import Texture from "./Texture";
import config from "../../config";
import { useTick } from "@inlet/react-pixi";

let getNextPos = (position = 0, destPosition = 0, velocity = 0) => {
  let nextPos = position + velocity;
  let arrived =
    velocity > 0 ? nextPos >= destPosition : nextPos <= destPosition;
  return [arrived, nextPos];
};

let Bone = ({
  index,
  boneCount,
  x,
  y,
  destX,
  destY,
  destination,
  direction,
  preloadedAnimations,
  dead,
  arrived = () => {}
}) => {
  // console.log("🦴");
  let [virtualX, setVirtualX] = useState(x);
  let [virtualY, setVirtualY] = useState(y);

  useTick(delta => {
    let xArrived = undefined;
    let yArrived = undefined;
    let nextX = null;
    let nextY = null;
    let tickVelosity = delta * config.velocity;

    if (destX !== virtualX) {
      [xArrived, nextX] = getNextPos(
        virtualX,
        destX,
        virtualX < destX ? tickVelosity : -1 * tickVelosity
      );
      setVirtualX(xArrived ? destX : nextX);
    }
    if (destY !== virtualY) {
      [yArrived, nextY] = getNextPos(
        virtualY,
        destY,
        virtualY < destY ? tickVelosity : -1 * tickVelosity
      );
      setVirtualY(yArrived ? destY : nextY);
    }

    if (xArrived === true || yArrived === true) {
      arrived(index, destination);
    }
  });

  return (
    <Texture
      x={x}
      y={y}
      direction={direction}
      preloadedAnimations={preloadedAnimations}
      dead={dead}
      bodypart={index === 0 ? "HD" : index === boneCount - 1 ? "TL" : "BY"}
    />
  );
};

Bone.propTypes = {
  index: PropTypes.number.isRequired,
  boneCount: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  destX: PropTypes.number.isRequired,
  destY: PropTypes.number.isRequired,
  destination: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),
  direction: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  }),
  animations: PropTypes.object.isRequired,
  preloadedAnimations: PropTypes.object.isRequired,
  dead: PropTypes.bool.isRequired,
  spritesheet: PropTypes.object.isRequired,
  arrived: PropTypes.func.isRequired
};

export default Bone;
