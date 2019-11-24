import { FILENAME_SEGMENTS, setMoving, setPosition } from "../redux/worm";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AnimatedSprite } from "pixi.js";
import AnimatedSpritesheet from "./pixi/AnimatedSprite.js";
import PropTypes from "prop-types";
import config from "../config";
import { useTick } from "@inlet/react-pixi";

let getNextPos = (nextPosition = 0, destPosition = 0, velocity = 0) => {
  let nextPos = nextPosition + velocity;
  let arrived =
    velocity > 0 ? nextPos >= destPosition : nextPos <= destPosition;
  return [arrived, nextPos];
};

const createAnimation = (spritesheet, animation) => {
  let animationArr = spritesheet.spritesheet.animations[animation.name];
  let newAnimation = new AnimatedSprite(animationArr);
  newAnimation.animationSpeed = animation.speed;
  newAnimation.y = animation.offset.y;
  newAnimation.x = animation.offset.x;
  newAnimation.width = animation.space.width * config.tileSize;
  newAnimation.height = animation.space.height * config.tileSize;
  newAnimation.play();
  console.log("📼");
  return newAnimation;
};

let Bone = ({
  index,
  x,
  y,
  destX,
  destY,
  destination,
  direction,
  nextNeighbourDirection,
  animations,
  spritesheet
}) => {
  console.log("🦴");
  let dispatch = useDispatch();
  let [animation, setAnimation] = useState(null);
  const [virtualX, setVirtualX] = useState(x);
  const [virtualY, setVirtualY] = useState(y);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    setAnimation(() => {
      let nextDirection = nextNeighbourDirection
        ? nextNeighbourDirection
        : direction;
      let animationName = `WORM-BY/${FILENAME_SEGMENTS[nextDirection]}/2${FILENAME_SEGMENTS[direction]}`;

      if (Object.keys(animations).includes(animationName)) {
        return createAnimation(spritesheet, animations[animationName]);
      } else {
        console.warn(`${animationName} is missing in spritesheets`);
      }
    });
  }, [x, y, direction]);

  useTick(delta => {
    let newY = y;
    let newX = x;
    let xArrived = undefined;
    let yArrived = undefined;
    let tickVelosity = delta * config.controls.velocity;
    // console.log("🔃", destX, destY);
    if (destX !== x) {
      let [xArrived, xInterpolated] = getNextPos(
        x,
        destX,
        x < destX ? tickVelosity : -1 * tickVelosity
      );

      newX = xArrived ? destX : xInterpolated;
    } else {
      xArrived = true;
    }
    if (destY !== y) {
      let [yArrived, yInterpolated] = getNextPos(
        y,
        destY,
        y < destY ? tickVelosity : -1 * tickVelosity
      );
      newY = yArrived ? destY : yInterpolated;
    } else {
      yArrived = true;
    }

    if (xArrived === true || yArrived === true) {
      // console.log("!!!", newX, newY);
      console.log(x, y);
      dispatch(setPosition(index, destination));
      dispatch(setMoving(false));
    }
  });

  return animation ? (
    <AnimatedSpritesheet x={x} y={y} animation={animation} />
  ) : null;
};

Bone.propTypes = {
  index: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  destX: PropTypes.number.isRequired,
  destY: PropTypes.number.isRequired,
  destination: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),
  direction: PropTypes.string.isRequired,

  nextNeighbourDirection: PropTypes.string,
  animations: PropTypes.object.isRequired,
  spritesheet: PropTypes.object.isRequired
};

let Worm = () => {
  console.log("🐛");
  // let dispatch = useDispatch();
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
      // moving: worm.moving,
      // heroSize: worm.tileSize,
      animations: worm.animations,
      spritesheet: stage.assets.spritesheet
    };
  });

  // const [x, setX] = useState(positionStage.map(pos => pos.x));
  // const [y, setY] = useState(positionStage.map(pos => pos.y));

  // const [virtualX, setVirtualX] = useState(x);
  // const [virtualY, setVirtualY] = useState(y);

  // useTick(delta => {
  //   let arrivedX = false,
  //     arrivedY = false,
  //     newPos = null,
  //     tickVelosity = delta * config.controls.velocity;
  //   let newX = [];
  //   virtualX.forEach((xPos, i) => {
  //     if (xPos < destinationStage[i].x) {
  //       [arrivedX, newPos] = getNextPos(
  //         xPos,
  //         destinationStage[i].x,
  //         tickVelosity
  //       );
  //       newX[i] = arrivedX ? destinationStage[i].x : newPos;
  //     } else if (xPos > destinationStage[i].x) {
  //       [arrivedX, newPos] = getNextPos(
  //         xPos,
  //         destinationStage[i].x,
  //         -1 * tickVelosity
  //       );

  //       newX[i] = arrivedX ? destinationStage[i].x : newPos;
  //     } else {
  //       newX[i] = xPos;
  //     }
  //   });

  //   let newY = [];
  //   virtualY.forEach((yPos, i) => {
  //     if (yPos < destinationStage[i].y) {
  //       [arrivedY, newPos] = getNextPos(
  //         yPos,
  //         destinationStage[i].y,
  //         tickVelosity
  //       );
  //       newY[i] = arrivedY ? destinationStage[i].y : newPos;
  //     } else if (yPos > destinationStage[i].y) {
  //       [arrivedY, newPos] = getNextPos(
  //         yPos,
  //         destinationStage[i].y,
  //         -1 * tickVelosity
  //       );
  //       newY[i] = arrivedY ? destinationStage[i].y : newPos;
  //     } else {
  //       newY[i] = yPos;
  //     }
  //   });

  //   setVirtualY(newY);
  //   setVirtualX(newX);

  //   if (arrivedY === true || arrivedX === true) {
  //     setY(newY);
  //     setX(newX);
  //     dispatch(setPosition(destination));
  //     dispatch(setMoving(false));
  //   }
  // });

  // // store them once and return an instance
  // const createAnimation = useCallback(
  //   an => {
  //     let animationArr = spritesheet.spritesheet.animations[an.name];
  //     let animation = new AnimatedSprite(animationArr);
  //     animation.animationSpeed = an.speed;
  //     animation.y = an.offset.y;
  //     animation.x = an.offset.x;
  //     animation.width = an.space.width * config.tileSize;
  //     animation.height = an.space.height * config.tileSize;
  //     animation.play();
  //     return animation;
  //   },
  //   [spritesheet.spritesheet.animations]
  // );

  // let [fake, setFake] = useState(null);
  // useEffect(() => {
  //   let animationName = `WORM-HD/${FILENAME_SEGMENTS[direction[0]]}/Entry`;
  //   if (Object.keys(animations).includes(animationName)) {
  //     setFake(createAnimation(animations[animationName]));
  //   } else {
  //     console.warn(`${animationName} is missing in spritesheets`);
  //   }
  // }, [destination, createAnimation, animations, direction]);

  // let [wormAnimations, setWormAnimations] = useState(null);
  // useEffect(() => {
  //   // TODO:
  //   // store direction for every worm fragment
  //   // ttry to use useEffect for setting the x and y for every tile (may create a arrived variable with setState and watch it with the useEffect)

  //   setWormAnimations(
  //     positionStage.map((pos, i, positions) => {
  //       let nextDirection =
  //         i === positions.length - 1 ? direction[i] : direction[i + 1];
  //       let animationName = `WORM-BY/${FILENAME_SEGMENTS[nextDirection]}/2${
  //         FILENAME_SEGMENTS[direction[i]]
  //       }`;
  //       if (Object.keys(animations).includes(animationName)) {
  //         console.log(animationName);
  //         return createAnimation(animations[animationName]);
  //       } else {
  //         console.warn(`${animationName} is missing in spritesheets`);
  //       }
  //     })
  //   );
  // }, [createAnimation, positionStage, animations, direction]);

  return (
    <React.Fragment>
      {/* {fake ? (
        <AnimatedSpritesheet
          x={destinationStage[0].x}
          y={destinationStage[0].y}
          animation={fake}
          key={`${fake}-${destination.x}-${destination.y}`}
        />
      ) : null} */}
      {positionStage.map((position, i) => {
        return (
          <Bone
            key={`bone-${i}`}
            {...position}
            index={i}
            destX={destinationStage[i].x}
            destY={destinationStage[i].y}
            destination={destination[i]}
            direction={direction[i]}
            spritesheet={spritesheet}
            animations={animations}
            nextNeighbourDirection={
              direction.length === i ? direction[i + 1] : null
            }
          />
        );
      })}
    </React.Fragment>
  );
};

export default Worm;
