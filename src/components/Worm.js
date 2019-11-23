import React, { useCallback, useState } from "react";
import { setMoving, setPosition } from "../redux/worm";
import { useDispatch, useSelector } from "react-redux";

import { AnimatedSprite } from "pixi.js";
import AnimatedSpritesheet from "./pixi/AnimatedSprite.js";
import config from "../config";
import { useTick } from "@inlet/react-pixi";

let getNextPos = (nextPosition = 0, destPosition = 0, velocity = 0) => {
  let nextPos = nextPosition + velocity;
  let arrived =
    velocity > 0 ? nextPos >= destPosition : nextPos <= destPosition;
  return [arrived, nextPos];
};

let Worm = () => {
  let dispatch = useDispatch();
  const {
    positionStage,
    destinationStage,
    destination,
    direction,
    animations,
    spritesheet
  } = useSelector(state => {
    let { worm, stage } = state;
    return {
      positionStage: worm.position.map(pos => {
        // rename this in whaterStage
        return { x: stage.tileSize * pos.x, y: stage.tileSize * pos.y };
      }),
      destinationStage: worm.destination.map(pos => {
        // rename this in whaterStage
        return { x: stage.tileSize * pos.x, y: stage.tileSize * pos.y };
      }),
      destination: worm.destination,
      direction: worm.direction,
      moving: worm.moving,
      heroSize: worm.tileSize,
      animations: worm.animations,
      spritesheet: stage.assets.spritesheet
    };
  });

  const [x, setX] = useState(positionStage.map(pos => pos.x));
  const [y, setY] = useState(positionStage.map(pos => pos.y));

  useTick(delta => {
    let arrivedX = false,
      arrivedY = false,
      newPos = null,
      tickVelosity = delta * config.controls.velocity;

    let newX = x.map((xPos, i) => {
      if (xPos < destinationStage[i].x) {
        [arrivedX, newPos] = getNextPos(
          xPos,
          destinationStage[i].x,
          tickVelosity
        );

        return arrivedX ? destinationStage[i].x : newPos;
      } else if (xPos > destinationStage[i].x) {
        [arrivedX, newPos] = getNextPos(
          xPos,
          destinationStage[i].x,
          -1 * tickVelosity
        );

        return arrivedX ? destinationStage[i].x : newPos;
      } else {
        return xPos;
      }
    });

    let newY = y.map((yPos, i) => {
      if (yPos < destinationStage[i].y) {
        [arrivedY, newPos] = getNextPos(
          yPos,
          destinationStage[i].y,
          tickVelosity
        );
        return arrivedY ? destinationStage[i].y : newPos;
      } else if (yPos > destinationStage[i].y) {
        [arrivedY, newPos] = getNextPos(
          yPos,
          destinationStage[i].y,
          -1 * tickVelosity
        );
        return arrivedY ? destinationStage[i].y : newPos;
      } else {
        return yPos;
      }
    });

    setY(newY);
    setX(newX);

    if (arrivedY === true && arrivedY === true) {
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

  // useEffect(() => {
  //   setAnimation(createAnimation());
  // }, [direction, animations, createAnimation]);

  const [animation, setAnimation] = useState(createAnimation);
  const [tailAnimations, setTailAnimations] = useState(
    positionStage.map(() => createAnimation())
  );

  return (
    <React.Fragment>
      {animation ? (
        <React.Fragment>
          {x.map((xPos, i) => {
            return (
              <AnimatedSpritesheet
                x={xPos}
                y={y[i]}
                animation={tailAnimations[i]}
                key={`${i}-${xPos}-${y[i]}`}
              />
            );
          })}
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export default Worm;
