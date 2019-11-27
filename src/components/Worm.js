import { FILENAME_SEGMENTS, setPosition } from "../redux/worm";
import React, { useEffect, useState } from "react";
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
  animations,
  dead,
  spritesheet,
  arrived = () => {}
}) => {
  // console.log("🦴");
  let [animation, setAnimation] = useState(null);
  let [virtualX, setVirtualX] = useState(x);
  let [virtualY, setVirtualY] = useState(y);

  useEffect(() => {
    setAnimation(() => {
      let animationName = `WORM-BY/${FILENAME_SEGMENTS[direction.from]}/2${
        FILENAME_SEGMENTS[direction.to]
      }`;

      if (Object.keys(animations).includes(animationName)) {
        return createAnimation(spritesheet, animations[animationName]);
      } else {
        console.warn(`${animationName} is missing in spritesheets`);
      }
    });
  }, [x, y, direction, animations, spritesheet]);

  useEffect(() => {
    setAnimation(animation => {
      animation.stop();
      return animation;
    });
  }, [dead]);

  useTick(delta => {
    let xArrived = undefined;
    let yArrived = undefined;
    let nextX = null;
    let nextY = null;
    let tickVelosity = delta * config.controls.velocity;

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
  direction: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  }),
  animations: PropTypes.object.isRequired,
  dead: PropTypes.bool.isRequired,
  spritesheet: PropTypes.object.isRequired,
  arrived: PropTypes.func.isRequired
};

let Worm = () => {
  // console.log("🐛");
  let dispatch = useDispatch();
  const {
    positionStage,
    destinationStage,
    destination,
    direction,
    animations,
    dead,
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
      animations: worm.animations,
      dead: worm.dead,
      spritesheet: stage.assets.spritesheet
    };
  });

  let [nextPositions, setNextPositions] = useState({});

  let arrived = (boneIndex, position) => {
    setNextPositions(old => ({ ...old, [boneIndex]: position }));
  };

  useEffect(() => {
    /**
     * as soon as all bones have submitted their next position,
     * dispatch it to redux and reset internal state
     */
    if (Object.keys(nextPositions).length === positionStage.length) {
      dispatch(
        setPosition(
          Object.keys(nextPositions)
            .sort()
            .map(key => nextPositions[key])
        )
      );
      setNextPositions({});
    }
  }, [nextPositions, positionStage.length, dispatch]);

  return (
    <React.Fragment>
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
            dead={dead}
            arrived={arrived}
          />
        );
      })}
    </React.Fragment>
  );
};

export default Worm;
