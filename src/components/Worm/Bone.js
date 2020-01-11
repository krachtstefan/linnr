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
  destX, // todo destX and destY can be replaces by something like x + tilesize, just call it progress
  destY,
  direction,
  preloadedAnimations,
  dead,
  arrived = () => {},
  checkCollision = () => {}
}) => {
  // console.log("🦴");
  let [virtualX, setVirtualX] = useState(x);
  let [virtualY, setVirtualY] = useState(y);
  let [collisionCheckAllowed, setCollisionCheckAllowed] = useState(true);
  let collisionCheckThreshold = 0.5;

  useTick(deltaMs => {
    let xArrived = undefined;
    let yArrived = undefined;
    let nextX = null;
    let nextY = null;
    let tickVelosity = deltaMs * config.velocity;

    /**
     * let the head bone trigger the checkCollision callback function
     * once very move
     */
    if (index === 0) {
      if (
        destY - y !== 0 && // y position is currently progressing
        collisionCheckAllowed === true && // collision check is allowed
        Math.abs((virtualY - y) / (destY - y)) > collisionCheckThreshold // progress is over the threshold
      ) {
        checkCollision();
        setCollisionCheckAllowed(false);
      }

      if (
        destX - x !== 0 &&
        collisionCheckAllowed === true &&
        Math.abs((virtualX - x) / (destX - x)) > collisionCheckThreshold
      ) {
        checkCollision();
        setCollisionCheckAllowed(false);
      }
    }

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
      arrived(index);
      setCollisionCheckAllowed(true); // allow collision check again
    }
  });

  return (
    <Texture
      x={x}
      y={y}
      direction={direction}
      preloadedAnimations={preloadedAnimations}
      dead={dead}
      bodypart={
        index === 0
          ? "HD"
          : index === 1
          ? "HD2"
          : index === boneCount - 1
          ? "TL2"
          : index === boneCount - 2
          ? "TL"
          : "BY"
      }
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
  direction: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  }),
  animations: PropTypes.object.isRequired,
  preloadedAnimations: PropTypes.object.isRequired,
  dead: PropTypes.bool.isRequired,
  spritesheet: PropTypes.object.isRequired,
  arrived: PropTypes.func.isRequired,
  checkCollision: PropTypes.func.isRequired
};

export default Bone;
