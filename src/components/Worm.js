import React, { useCallback, useEffect, useState } from "react";
import { setMoving, setPosition } from "../redux/worm";
import { useDispatch, useSelector } from "react-redux";

import { AnimatedSprite } from "pixi.js";
import AnimatedSpritesheet from "./pixi/AnimatedSprite.js";
import config from "../config";
import { useTick } from "@inlet/react-pixi";

let Worm = () => {
  let dispatch = useDispatch();
  const {
    positionStage,
    destinationStage,
    destination,
    direction,
    animations,
    spritesheet,
    moving
  } = useSelector(state => {
    let { worm, stage } = state;
    return {
      positionStage: {
        x: stage.tileSize * worm.position.x,
        y: stage.tileSize * worm.position.y
      },
      destinationStage: {
        x: stage.tileSize * worm.destination.x,
        y: stage.tileSize * worm.destination.y
      },
      destination: worm.destination,
      direction: worm.direction,
      moving: worm.moving,
      heroSize: worm.tileSize,
      animations: worm.animations,
      spritesheet: state.stage.spritesheet
    };
  });

  const [x, setX] = useState(positionStage.x);
  const [y, setY] = useState(positionStage.y);

  let getNextPos = (nextPosition = 0, destPosition = 0, velocity = 0) => {
    let nextPos = nextPosition + velocity;
    let arrived =
      velocity > 0 ? nextPos >= destPosition : nextPos <= destPosition;
    return [arrived, nextPos];
  };

  useTick(delta => {
    let arrived = false,
      newPos = null,
      tickVelosity = delta * config.controls.velocity;

    if (x < destinationStage.x) {
      [arrived, newPos] = getNextPos(x, destinationStage.x, tickVelosity);
      setX(arrived ? destinationStage.x : newPos);
    } else if (x > destinationStage.x) {
      [arrived, newPos] = getNextPos(x, destinationStage.x, -1 * tickVelosity);
      setX(arrived ? destinationStage.x : newPos);
    } else if (y < destinationStage.y) {
      [arrived, newPos] = getNextPos(y, destinationStage.y, tickVelosity);
      setY(arrived ? destinationStage.y : newPos);
    } else if (y > destinationStage.y) {
      [arrived, newPos] = getNextPos(y, destinationStage.y, -1 * tickVelosity);
      setY(arrived ? destinationStage.y : newPos);
    }
    if (arrived) {
      dispatch(setPosition(destination));
      dispatch(setMoving(false));
    }
  });

  const createAnimation = useCallback(() => {
    const { idle } = animations;
    let animationArr = spritesheet.spritesheet.animations[idle.name];
    let animation = new AnimatedSprite(animationArr);
    animation.animationSpeed = idle.speed;
    animation.y = idle.offset.y;
    animation.x = idle.offset.x;
    animation.width = idle.space.width * config.tileSize;
    animation.height = idle.space.height * config.tileSize;
    animation.play();
    return animation;
  }, [animations, spritesheet.spritesheet.animations]);

  useEffect(() => {
    setAnimation(createAnimation());
  }, [direction, animations, createAnimation, moving]);

  const [animation, setAnimation] = useState(createAnimation);

  return (
    <React.Fragment>
      {animation ? (
        <AnimatedSpritesheet x={x} y={y} animation={animation} />
      ) : null}
    </React.Fragment>
  );
};

export default Worm;
