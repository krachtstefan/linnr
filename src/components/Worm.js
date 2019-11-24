import React, { useCallback, useEffect, useState } from "react";
import { WORM_DIRECTIONS, setMoving, setPosition } from "../redux/worm";
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
      positionStage: worm.position.map(pos => ({
        x: stage.tileSize * pos.x,
        y: stage.tileSize * pos.y
      })),
      destinationStage: worm.destination.map(pos => ({
        x: stage.tileSize * pos.x,
        y: stage.tileSize * pos.y
      })),
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

  const [virtualX, setVirtualX] = useState(x);
  const [virtualY, setVirtualY] = useState(y);

  useTick(delta => {
    let arrivedX = false,
      arrivedY = false,
      newPos = null,
      tickVelosity = delta * config.controls.velocity;
    let newX = [];
    virtualX.forEach((xPos, i) => {
      if (xPos < destinationStage[i].x) {
        [arrivedX, newPos] = getNextPos(
          xPos,
          destinationStage[i].x,
          tickVelosity
        );
        newX[i] = arrivedX ? destinationStage[i].x : newPos;
      } else if (xPos > destinationStage[i].x) {
        [arrivedX, newPos] = getNextPos(
          xPos,
          destinationStage[i].x,
          -1 * tickVelosity
        );

        newX[i] = arrivedX ? destinationStage[i].x : newPos;
      } else {
        newX[i] = xPos;
      }
    });

    let newY = [];
    virtualY.forEach((yPos, i) => {
      if (yPos < destinationStage[i].y) {
        [arrivedY, newPos] = getNextPos(
          yPos,
          destinationStage[i].y,
          tickVelosity
        );
        newY[i] = arrivedY ? destinationStage[i].y : newPos;
      } else if (yPos > destinationStage[i].y) {
        [arrivedY, newPos] = getNextPos(
          yPos,
          destinationStage[i].y,
          -1 * tickVelosity
        );
        newY[i] = arrivedY ? destinationStage[i].y : newPos;
      } else {
        newY[i] = yPos;
      }
    });

    setVirtualY(newY);
    setVirtualX(newX);

    if (arrivedY === true || arrivedX === true) {
      setY(newY);
      setX(newX);
      dispatch(setPosition(destination));
      dispatch(setMoving(false));
    }
  });

  // store them once and return an instance
  const createAnimation = useCallback(
    an => {
      let animationArr = spritesheet.spritesheet.animations[an.name];
      let animation = new AnimatedSprite(animationArr);
      animation.animationSpeed = an.speed;
      animation.y = an.offset.y;
      animation.x = an.offset.x;
      animation.width = an.space.width * config.tileSize;
      animation.height = an.space.height * config.tileSize;
      animation.play();
      return animation;
    },
    [spritesheet.spritesheet.animations]
  );

  let [fake, setFake] = useState(null);
  useEffect(() => {
    switch (direction[0]) {
      case WORM_DIRECTIONS.N:
        setFake(createAnimation(animations["WORM-HD/N/Entry"]));
        break;
      case WORM_DIRECTIONS.E:
        setFake(createAnimation(animations["WORM-HD/E/Entry"]));
        break;
      case WORM_DIRECTIONS.S:
        setFake(createAnimation(animations["WORM-HD/S/Entry"]));
        break;
      case WORM_DIRECTIONS.W:
        setFake(createAnimation(animations["WORM-HD/W/Entry"]));
        break;
    }
  }, [destination, createAnimation, animations, direction]);

  let [wormAnimations, setWormAnimations] = useState(null);
  useEffect(() => {
    // TODO:
    // store direction for every worm fragment
    // ttry to use useEffect for setting the x and y for every tile (may create a arrived variable with setState and watch it with the useEffect)

    setWormAnimations(
      positionStage.map((pos, i) => {
        switch (direction[i]) {
          case WORM_DIRECTIONS.N:
            return createAnimation(animations["WORM-BY/N/2N"]);
          case WORM_DIRECTIONS.E:
            return createAnimation(animations["WORM-BY/E/2E"]);
          case WORM_DIRECTIONS.S:
            return createAnimation(animations["WORM-BY/S/2S"]);
          case WORM_DIRECTIONS.W:
          default:
            return createAnimation(animations["WORM-BY/W/2W"]);
        }
      })
    );
  }, [createAnimation, positionStage, animations, direction]);

  return (
    <React.Fragment>
      {fake ? (
        <AnimatedSpritesheet
          x={destinationStage[0].x}
          y={destinationStage[0].y}
          animation={fake}
          key={`${fake}-${destination.x}-${destination.y}`}
        />
      ) : null}
      {wormAnimations
        ? x.map((xPos, i) => {
            return (
              <AnimatedSpritesheet
                x={xPos}
                y={y[i]}
                animation={wormAnimations[i]}
                key={`${i}-${xPos}-${y[i]}`}
              />
            );
          })
        : null}
    </React.Fragment>
  );
};

export default Worm;
